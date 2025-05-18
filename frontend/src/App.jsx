import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import ReserveProtected from "./pages/ReserveProtected";
import AdminPanel from "./pages/AdminPanel";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Profile from "./pages/Profile";
import { useAuth } from "./AuthContext";
import CashRegister from "./pages/CashRegister";

function App() {
  const { token, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  const isAuthenticated = () => token !== null;
  const isAdmin = () => user?.role === "admin";

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={isAuthenticated() ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/reserve" element={isAuthenticated() ? <ReserveProtected /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAdmin() ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/cash" element={isAdmin() ? <CashRegister /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;