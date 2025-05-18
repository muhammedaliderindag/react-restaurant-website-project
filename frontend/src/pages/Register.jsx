import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    tc: '',
    birthDate: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const tcRegex = /^[1-9][0-9]{10}$/;
  if (!tcRegex.test(formData.tc)) {
    alert('TC Kimlik numarası 11 haneli olmalı ve 0 ile başlamamalıdır.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${formData.name} ${formData.surname}`,
        email: formData.email,
        tc: formData.tc,
        birth_date: formData.birthDate,
        password: formData.password
      })
    });

    const result = await response.json();

    if (response.status === 201) {
      alert('✔ Başarıyla kayıt olundu!');
    } else if (response.status === 409) {
      alert('⚠ Bu e-mail ile zaten kayıtlı bir kullanıcı mevcut.');
    } else {
      alert('❌ Kayıt sırasında bir hata oluştu.');
    }
  } catch (err) {
    alert('❌ Sunucu hatası: ' + err.message);
  }
};


  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-yellow-500 p-10 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Kayıt Ol</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="İsim"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white focus:outline-none"
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Soyisim"
            value={formData.surname}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white focus:outline-none"
            required
          />
          <input
            type="text"
            name="tc"
            placeholder="TC Kimlik No"
            value={formData.tc}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white focus:outline-none"
            required
            maxLength="11"
          />
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 text-white focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
}
