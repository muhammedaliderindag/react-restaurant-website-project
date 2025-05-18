
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

export default function Kasa() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [tableMap, setTableMap] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, tablesRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3001/api/orders", { headers }),
          axios.get("http://localhost:3001/tables", { headers }),
          axios.get("http://localhost:3001/api/users", { headers }),
        ]);

        const tablesByUser = {};
        tablesRes.data.forEach(table => {
          if (table.reserved_by) {
            tablesByUser[table.reserved_by] = table.table_number;
          }
        });

        const userNames = {};
        usersRes.data.forEach(user => {
          userNames[user.id] = user.name;
        });

        const groupedOrders = {};
        ordersRes.data.forEach(order => {
          const tableNo = tablesByUser[order.user] || "Bilinmiyor";
          if (!groupedOrders[tableNo]) groupedOrders[tableNo] = [];

          groupedOrders[tableNo].push({
            item: order.item,
            quantity: order.quantity,
            price: order.price,
            user: userNames[order.user],
          });
        });

        setOrderHistory(groupedOrders);
      } catch (err) {
        console.error("Kasa verisi alınamadı:", err);
      }
    };

    fetchOrders();
  }, [token]);

  const getTotal = (orders) => {
    return orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-6 text-yellow-400 font-bold">💰 Kasa Geçmişi</h1>
      {Object.entries(orderHistory).map(([table, orders], index) => (
        <div key={index} className="bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-yellow-300 mb-2">Masa {table}</h2>
          <ul className="mb-2">
            {orders.map((o, idx) => (
              <li key={idx} className="flex justify-between border-b border-gray-600 py-1">
                <span>{o.item} × {o.quantity}</span>
                <span>{(o.price * o.quantity).toFixed(2)} TL</span>
              </li>
            ))}
          </ul>
          <div className="text-right text-yellow-400 font-bold">
            Toplam: {getTotal(orders).toFixed(2)} TL
          </div>
        </div>
      ))}
    </div>
  );
}
