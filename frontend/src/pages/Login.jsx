
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      alert("Giriş başarısız!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="bg-gray-900 p-6 rounded space-y-4 border border-yellow-500 w-80">
        <h2 className="text-xl font-bold text-yellow-400">Giriş Yap</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        />
        <button type="submit" className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300">
          Giriş Yap
        </button>

<p className="text-center text-sm">Hesabınız yok mu? <Link to="/register" className="text-yellow-600 hover:underline">Kayıt olun</Link></p>
      </form>
    </div>
  );
}
