import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

export default function TableOrders() {
  const { token } = useAuth();
  const [tableOrders, setTableOrders] = useState([]);

  useEffect(() => {
    const fetchTableOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/table-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTableOrders(res.data);
      } catch (err) {
        console.error("Masa siparişleri çekilemedi:", err);
      }
    };

    fetchTableOrders();
  }, [token]);

  return (
    <div className="p-6 bg-black text-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">🍽️ Masa Siparişleri</h2>
      {tableOrders.map((table, index) => (
        <div key={index} className="mb-6 border border-yellow-500 rounded-lg p-4">
          <h3 className="text-xl text-yellow-300 mb-2">Masa No: {table.table_number}</h3>
          <p className="text-gray-300 mb-2">Rezerve Eden: {table.user_name} ({table.user_email})</p>
          <ul className="list-disc list-inside text-gray-200 mb-2">
            {table.items.map((item, i) => (
              <li key={i}>
                {item.name} x {item.quantity} = {item.quantity * item.price}₺
              </li>
            ))}
          </ul>
          <p className="font-bold text-green-400">Toplam: {table.total}₺</p>
        </div>
      ))}
    </div>
  );
}