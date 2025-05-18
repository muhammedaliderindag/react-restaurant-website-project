import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", image: null });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [uRes, oRes, tRes, mRes] = await Promise.all([
        axios.get("http://localhost:3001/api/users", { headers }),
        axios.get("http://localhost:3001/api/orders", { headers }),
        axios.get("http://localhost:3001/tables", { headers }),
        axios.get("http://localhost:3001/menu", { headers }),
      ]);
      setUsers(uRes.data);
      setOrders(oRes.data);
      setTables(tRes.data);
      setMenuItems(mRes.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setError("Veriler alınamadı.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bu kullanıcıyı silmek istiyor musunuz?")) return;
    await axios.delete(`http://localhost:3001/api/users/${id}`, { headers });
    fetchData();
  };

  const handleDeliverOrder = async (id) => {
    await axios.post(`http://localhost:3001/api/orders/deliver/${id}`, {}, { headers });
    fetchData();
  };

  const handleCancelReservation = async (tableNumber) => {
    try {
      await axios.post("http://localhost:3001/cancel-reservation-byadmin", { tableNumber }, { headers });
      fetchData();
    } catch (err) {
      console.error("Rezervasyon iptal hatası:", err);
    }
  };

  const handleAddProduct = async () => {
    if (!newItem.name || !newItem.price || !newItem.category || !newItem.image) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("category", newItem.category);
    formData.append("image", newItem.image);

    try {
      await axios.post("http://localhost:3001/menu", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNewItem({ name: "", price: "", category: "", image: null });
      fetchData();
    } catch (err) {
      console.error("Ürün ekleme hatası:", err);
      alert("Ürün eklenemedi.");
    }
  };

  const handleDeleteProduct = async (id) => {
    await axios.delete(`http://localhost:3001/api/menu/${id}`, { headers });
    fetchData();
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Panel 1 - Kullanıcılar */}
      <div className="w-1/4 p-4 border-r border-yellow-600 overflow-y-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">👥 Kullanıcılar</h2>
        {error && <p className="text-red-500">{error}</p>}
        {users.map((u) => (
          <div key={u.id} className="bg-gray-900 border border-yellow-500 rounded-lg p-3 mb-3">
            <p><strong>Ad:</strong> {u.name}</p>
            <p><strong>T.C.:</strong> {u.tc}</p>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Doğum:</strong> {new Date(u.birth_date).toLocaleDateString()}</p>
            <p><strong>Rol:</strong> {u.role}</p>
            <button
              onClick={() => handleDeleteUser(u.id)}
              className="mt-2 bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded w-full"
            >
              Sil
            </button>
          </div>
        ))}
      </div>

      {/* Panel 2 - Siparişler */}
      <div className="w-1/4 p-4 border-r border-yellow-600 overflow-y-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">🧾 Siparişler</h2>
        {orders.map((o) => (
          <div key={o.id} className="bg-gray-900 border border-yellow-500 rounded-lg p-3 mb-3">
            <p><strong>Kullanıcı:</strong> {o.user}</p>
            <p><strong>Ürün:</strong> {o.item}</p>
            <p><strong>Adet:</strong> {o.quantity}</p>
            <p><strong>Toplam:</strong> ₺{o.price * o.quantity}</p>
            <button
              onClick={() => handleDeliverOrder(o.id)}
              className="mt-2 bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded w-full"
            >
              Teslim Et
            </button>
          </div>
        ))}
      </div>

      {/* Panel 3 - Rezerve Masalar */}
      <div className="w-1/4 p-4 border-r border-yellow-600 overflow-y-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">📅 Rezervasyonlar</h2>
        {Array.isArray(tables) && tables.filter(t => t.is_reserved).length === 0 ? (
          <p className="text-gray-400">Rezerve masa yok.</p>
        ) : (
          Array.isArray(tables) && tables.filter(t => t.is_reserved).map((table) => (
            <div key={table.id} className="bg-gray-900 border border-yellow-500 rounded-lg p-3 mb-3">
              <p><strong>Masa No:</strong> {table.table_number}</p>
              <p><strong>Kullanıcı ID:</strong> {table.reserved_by}</p>
              <button
                onClick={() => handleCancelReservation(table.table_number)}
                className="mt-2 bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded w-full"
              >
                İptal Et
              </button>
            </div>
          ))
        )}
      </div>

      {/* Panel 4 - Menü Yönetimi */}
      <div className="w-1/4 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">🍽️ Menü Yönetimi</h2>

        {/* Yeni ürün ekleme */}
        <div className="space-y-2 mb-6">
          <input
            type="text"
            placeholder="Ürün adı"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded text-white"
          />
          <input
            type="number"
            placeholder="Fiyat (₺)"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded text-white"
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded text-white"
          >
            <option value="">Kategori Seç</option>
            <option value="Çorba">Çorba</option>
            <option value="Ana Yemek">Ana Yemek</option>
            <option value="Ara Sıcak">Ara Sıcak</option>
            <option value="Tatlı">Tatlı</option>
            <option value="İçecek">İçecek</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded text-white"
          />
          <button
            onClick={handleAddProduct}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded"
          >
            Ürünü Ekle
          </button>
        </div>

        {/* Mevcut ürünler */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-yellow-500 rounded-lg p-3 flex justify-between items-center">
              <span>{item.name} - ₺{item.price}</span>
              <button
                onClick={() => handleDeleteProduct(item.id)}
                className="text-red-400 hover:text-red-200"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
