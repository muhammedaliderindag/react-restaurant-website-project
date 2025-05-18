
import { useEffect, useState } from "react";
import axios from "axios";
import { Utensils, Eye, Droplet, Building } from "lucide-react";

export default function TableGrid() {
  const [tables, setTables] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUser();
    fetchTables();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(res.data.id);
    } catch {
      setMessage("Kullanıcı bilgisi alınamadı");
    }
  };

  const fetchTables = async () => {
    try {
      const res = await axios.get("/api/tables");
      setTables(res.data);
    } catch {
      setMessage("Masalar alınamadı");
    }
  };

  const reserve = async (tableNumber) => {
    const token = localStorage.getItem("token");
    const dateTimeNow = new Date().toISOString();
    try {
      const res = await axios.post(
        "/api/reserve",
        { tableNumber, dateTime: dateTimeNow },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setMessage(`Masa ${tableNumber} başarıyla rezerve edildi`);
        fetchTables();
      } else {
        setMessage("Rezervasyon başarısız");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Rezervasyon başarısız");
    }
  };

  const cancelReservation = async (tableNumber) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "/api/cancel-reservation",
        { tableNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setMessage(`Masa ${tableNumber} rezervasyonu iptal edildi`);
        fetchTables();
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "İptal başarısız");
    }
  };

  const renderTable = (tableNumber, label) => {
    const table = tables.find((t) => t.table_number === tableNumber);
    const isMine = table?.reserved_by === userId;
    const isReserved = table?.is_reserved;

    return (
      <button
        key={tableNumber}
        onClick={() =>
          !isReserved
            ? reserve(tableNumber)
            : isMine
            ? cancelReservation(tableNumber)
            : null
        }
        disabled={isReserved && !isMine}
        className={
          "rounded-xl font-semibold shadow-md flex flex-col items-center justify-center text-xs transition h-20 w-24 border-2 " +
          (!isReserved
            ? "bg-yellow-400 hover:bg-yellow-500 text-black"
            : isMine
            ? "bg-yellow-600 hover:bg-yellow-500 text-black"
            : "bg-black text-yellow-400 cursor-not-allowed")
        }
      >
        <Utensils size={16} />
        <div>Masa {tableNumber}</div>
        <div className="text-[10px] opacity-70">{label}</div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black py-10 px-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">🍽️ Masa Rezervasyonu</h2>
      {message && <div className="mb-4 text-yellow-300">{message}</div>}

      <div className="grid grid-cols-6 gap-6 bg-gray-900 p-6 rounded-2xl shadow-lg max-w-7xl">
        <div className="col-span-6 flex justify-between items-center mb-2 text-yellow-300 text-sm">
          <span className="flex items-center gap-1"><Eye size={16} /> Cam Kenarı</span>
          <span className="flex items-center gap-1"><Droplet size={16} /> WC</span>
          <span className="flex items-center gap-1"><Building size={16} /> Kasa</span>
        </div>

        
{renderTable(1, "Cam Kenarı - Giriş Sağı")}
{renderTable(2, "Cam Kenarı - Giriş Solu")}
{renderTable(3, "Cam Kenarı - Orta")}
{renderTable(4, "Cam Kenarı - Kasa Yakını")}
{renderTable(5, "Duvar - Sol Arka")}
{renderTable(6, "Duvar - Sağ Arka")}
{renderTable(7, "Köşe - Sol Arka")}
{renderTable(8, "Köşe - Sağ Arka")}
{renderTable(9, "Orta Masa - A")}
{renderTable(10, "Orta Masa - B")}
{renderTable(11, "Orta Masa - C")}
{renderTable(12, "Orta Masa - D")}
{renderTable(13, "Orta Masa - E")}
{renderTable(14, "WC Yakını - Sol")}
{renderTable(15, "WC Yakını - Sağ")}
{renderTable(16, "Kasa Önü - Sol")}
{renderTable(17, "Kasa Önü - Sağ")}
{renderTable(18, "Cam Yakını - Sol")}
{renderTable(19, "Cam Yakını - Sağ")}
{renderTable(20, "Duvar - Orta Sağ")}
{renderTable(21, "Loca")}
{renderTable(22, "Loca")}
{renderTable(23, "Loca")}
{renderTable(24, "Loca")}
</div>
    </div>
  );
}
