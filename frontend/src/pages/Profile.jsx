import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    tc: "",
    birth_date: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3001/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("Profil bilgisi alınamadı:", err));
  }, []);

  const formattedDate = new Date(userData.birth_date).toLocaleDateString("tr-TR");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-black border-2 border-yellow-500 rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-10">
          👤 Profil Bilgileri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProfileField label="Ad Soyad" value={userData.name} />
          <ProfileField label="TC Kimlik No" value={userData.tc} />
          <ProfileField label="Doğum Tarihi" value={formattedDate} />
          <ProfileField label="E-Posta" value={userData.email} className="md:col-span-2" />
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-yellow-300 mb-1">{label}</label>
      <div className="w-full bg-yellow-50 border border-yellow-400 rounded-lg px-4 py-2 text-black shadow">
        {value || "-"}
      </div>
    </div>
  );
}