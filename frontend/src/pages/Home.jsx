import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="h-screen w-full bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1920&q=80')"
      }}
    >
      {/* Karartma efekti */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* İçerik */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4 animate-fade-in">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-yellow-400 drop-shadow-lg mb-6 animate-slide-up">
          MEKAN'ımıza Hoşgeldiniz
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 animate-fade-in-slow">
          Eşsiz bir atmosfer, unutulmaz tatlar. Hemen menümüzü keşfedin veya masanızı ayırtın.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            to="/menu"
            className="px-8 py-3 text-lg font-semibold bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition animate-fade-in-delay"
          >
            Menüye Göz At
          </Link>
          <Link
            to="/reserve"
            className="px-8 py-3 text-lg font-semibold border border-yellow-400 text-yellow-400 rounded-xl hover:bg-yellow-500 hover:text-black transition animate-fade-in-delay"
          >
            Masa Rezerve Et
          </Link>
        </div>
      </div>
    </div>
  );
}