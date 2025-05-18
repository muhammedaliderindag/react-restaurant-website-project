import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  Home,
  Menu,
  ShoppingCart,
  Calendar,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Wallet,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const localToken = localStorage.getItem("token");
  const isLoggedIn = token || (localToken && localToken !== "null" && localToken !== "");

  const navLink = (to, label, Icon) => (
    <Link to={to} className="flex items-center gap-2 hover:text-yellow-300 transition">
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="bg-black text-white shadow-lg border-b-2 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          MEKAN
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {navLink("/", "Anasayfa", Home)}

          {isLoggedIn && (
            <>
              {navLink("/menu", "Menü", Menu)}
              {navLink("/cart", "Sepet", ShoppingCart)}
              {navLink("/reserve", "Rezervasyon", Calendar)}
              {navLink("/profile", "Profil", User)}

              {user?.role === "admin" && (
                <>
                  {navLink("/cash", "Kasa", Wallet)}
                  {navLink("/admin", "Admin", ShieldCheck)}
                </>
              )}

              <button onClick={handleLogout} className="flex items-center gap-2 hover:text-yellow-300 transition">
                <LogOut size={18} />
                Çıkış
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              {navLink("/login", "Giriş Yap", LogIn)}
              {navLink("/register", "Kayıt Ol", UserPlus)}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}