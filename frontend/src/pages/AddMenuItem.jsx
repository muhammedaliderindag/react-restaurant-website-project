import { useState, useEffect } from "react";
import axios from "axios";

export default function AddMenuItem() {
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newItem.name || !newItem.price || !newItem.category) {
      setError("Tüm alanları doldurun.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/menu", newItem, { headers });
      setMessage("Ürün başarıyla eklendi.");
      setNewItem({ name: "", price: "", category: "" });
    } catch (err) {
      setError("Ürün eklenemedi.");
    }
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10 border border-yellow-500">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Yeni Ürün Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleChange}
          placeholder="Ürün Adı"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="number"
          name="price"
          value={newItem.price}
          onChange={handleChange}
          placeholder="Fiyat (₺)"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <select
          name="category"
          value={newItem.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="">Kategori Seç</option>
          <option value="Çorba">Çorba</option>
          <option value="Ana Yemek">Ana Yemek</option>
          <option value="Ara Sıcak">Ara Sıcak</option>
          <option value="Tatlı">Tatlı</option>
          <option value="İçecek">İçecek</option>
        </select>
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300 transition"
        >
          Ürünü Ekle
        </button>
        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}
      </form>
    </div>
  );
}
