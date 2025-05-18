import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { token, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return null;
  const isLoggedIn = token && user;

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center border-b border-yellow-500">
      <Link to="/" className="text-xl font-bold text-yellow-400">
        MEKAN
      </Link>

      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-300">Anasayfa</Link>

        {isLoggedIn && (
          <>
            <Link to="/menu" className="hover:text-yellow-300">Menü</Link>
            <Link to="/cart" className="hover:text-yellow-300">Sepet</Link>
            <Link to="/reserve" className="hover:text-yellow-300">Rezervasyon</Link>
            <Link to="/profile" className="hover:text-yellow-300">Profil</Link>

            {user?.role === "admin" && (
              <>
                <Link to="/cash" className="hover:text-yellow-300">Kasa</Link>
                <Link to="/admin" className="hover:text-yellow-300">Admin</Link>
              </>
            )}

            <button onClick={handleLogout} className="hover:text-yellow-300">Çıkış</button>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" className="hover:text-yellow-300">Giriş Yap</Link>
            <Link to="/register" className="hover:text-yellow-300">Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}