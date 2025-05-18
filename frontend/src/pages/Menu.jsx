import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/menu")
      .then(res => setMenuItems(res.data))
      .catch(err => console.error("Menü alınamadı", err));
  }, []);

  const groupedByCategory = menuItems.reduce((acc, item) => {
    const category = item.category || "Diğer";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black py-10 px-4">
      <h1 className="text-4xl text-yellow-400 font-bold text-center mb-10">Menü</h1>
      <div className="space-y-12">
        {Object.entries(groupedByCategory).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl text-yellow-400 font-bold text-center mb-6 border-b border-yellow-600 pb-2">
              {category}
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {items.map((item, index) => (
                <MenuItemCard key={index} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuItemCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/cart", {
        itemId: item.id,
        quantity: quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(i => i.name === item.name);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...item, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(cart));

      alert(`${item.name} sepete eklendi (${quantity} adet)`);
    } catch (err) {
      console.error("Sepete ekleme hatası:", err);
      alert("Ürün sepete eklenirken hata oluştu");
    }
  };

  return (
    <div className="bg-yellow-50 rounded-2xl shadow-xl p-5 w-72 text-center border border-yellow-500 hover:scale-105 transition-transform">
      <img
  src={`http://localhost:3001${item.image}`}
  alt={item.name}
  className="w-full h-40 object-cover rounded-xl mb-4"
/>

      <h2 className="text-xl font-semibold text-black mb-1">{item.name}</h2>
      <p className="text-gray-600 mb-1">{item.description}</p>
      <p className="text-yellow-700 font-bold text-lg mb-3">{item.price} ₺</p>

      <div className="flex justify-center items-center gap-4 mb-4">
        <button
          onClick={decrease}
          className="bg-black text-white px-3 py-1 rounded-full text-lg hover:bg-gray-800"
        >
          -
        </button>
        <span className="text-lg text-black font-medium">{quantity}</span>
        <button
          onClick={increase}
          className="bg-yellow-500 text-black px-3 py-1 rounded-full text-lg hover:bg-yellow-600"
        >
          +
        </button>
      </div>

      <button
        onClick={addToCart}
        className="bg-yellow-600 text-black font-semibold px-4 py-2 rounded-full hover:bg-yellow-700 transition"
      >
        Sepete Ekle
      </button>
    </div>
  );
};

export default Menu;
