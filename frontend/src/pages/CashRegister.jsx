import { useEffect, useState } from "react";
import axios from "axios";

export default function CashRegister() {
  const [data, setData] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3001/api/cash", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Veri çekilemedi:", err);
        alert("Kasa verisi alınamadı");
      });
  }, []);

  const grouped = data.reduce((acc, curr) => {
    const key = curr.table_number;
    if (!acc[key]) {
      acc[key] = {
        table_number: curr.table_number,
        customer_name: curr.customer_name,
        items: [],
        total: 0
      };
    }
    const price = parseFloat(curr.total_price);
    acc[key].items.push({
      name: curr.item_name,
      quantity: curr.quantity,
      total: !isNaN(price) ? price : 0
    });
    acc[key].total += !isNaN(price) ? price : 0;
    return acc;
  }, {});

  const tableList = Object.values(grouped);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans">
      {/* Sol Panel - Masa Listesi */}
      <div className="w-1/4 p-6 bg-black border-r border-yellow-500 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 border-b pb-2 border-yellow-600">🍽️ Masalar</h2>
        {tableList.map((table, index) => (
          <div
            key={index}
            onClick={() => setSelectedTable(table)}
            className={`cursor-pointer transition-all duration-200 p-4 mb-4 rounded-xl shadow hover:shadow-lg ${
              selectedTable?.table_number === table.table_number
                ? "bg-yellow-500 text-black font-semibold"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <p className="text-lg">Masa {table.table_number ?? "?"}</p>
            <p className="text-sm text-gray-300">{table.customer_name}</p>
          </div>
        ))}
      </div>

      {/* Sağ Panel - Sipariş Detayları */}
      <div className="w-3/4 p-8 overflow-y-auto">
        {selectedTable ? (
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Masa {selectedTable.table_number} • {selectedTable.customer_name}
            </h2>
            <ul className="space-y-4">
              {selectedTable.items.map((item, i) => (
                <li key={i} className="flex justify-between bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                  <span className="text-lg">{item.name} x{item.quantity}</span>
                  <span className="text-green-400 font-semibold">{item.total.toFixed(2)}₺</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-2xl font-bold text-green-400 border-t border-gray-600 pt-4 text-right">
              Toplam: {selectedTable.total.toFixed(2)}₺
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xl">
            Bir masa seçin.
          </div>
        )}
      </div>
    </div>
  );
}