import React, { useState, useEffect } from 'react';
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const removeItem = (name) => {
    const updatedCart = cart.filter(item => item.name !== name);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

const confirmOrder = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Lütfen giriş yapın.");
    return;
  }

  try {
    const res = await axios.get("http://localhost:3001/api/user-has-reservation", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.hasReservation) {
      alert("Lütfen önce masa rezerve edin.");
      return;
    }

    const orderRes = await axios.post("http://localhost:3001/api/confirm-order", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (orderRes.status === 200) {
      alert("Siparişiniz başarıyla alındı. Teşekkür ederiz!");
      clearCart();
    } else {
      alert("Sipariş sırasında bir hata oluştu.");
    }

  } catch (error) {
    console.error("Hata:", error);
    alert(error.response?.data?.error || "Sunucuya ulaşılamadı.");
  }
};





  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Sepetiniz</h1>

      {cart.length === 0 ? (
        <p className="text-center text-lg text-white">Sepetiniz boş.</p>
      ) : (
        <>
          <div className="space-y-6 max-w-3xl mx-auto">
            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-yellow-50 text-black flex justify-between items-center p-4 rounded-2xl shadow-md border border-yellow-500"
              >
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-700">
                    {item.quantity} x {item.price} ₺
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.name)}
                  className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">Toplam: {totalPrice} ₺</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={clearCart}
                className="bg-yellow-600 text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-700 transition w-full"
              >
                Sepeti Boşalt
              </button>
              <button
                onClick={confirmOrder}
                className="bg-black text-yellow-400 font-bold px-6 py-3 rounded-full hover:bg-gray-900 border border-yellow-400 w-full"
              >
                Sepeti Onayla
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
