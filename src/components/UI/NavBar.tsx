import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

interface NavbarProps {
  links?: { name: string; path: string }[]; // Lista de enlaces con nombre y ruta, opcional
  className?: string; // Clases CSS opcionales
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isLoggin, setIsLoggin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para manejar el menú móvil

  // Comprobamos el estado de `isLoggin` en localStorage cuando el componente se monta
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggin") === "true";
    setIsLoggin(loggedInStatus);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("isLoggin"); // Eliminamos el estado de "logueado"
    localStorage.removeItem("idUsuario"); // Eliminamos el ID del usuario
    setIsLoggin(false); // Actualizamos el estado local
    window.location.reload(); // Recargamos la página para reflejar los cambios
  };

  // Función para alternar el menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`flex flex-wrap items-center justify-between p-3 bg-teal-200/20 ${className}`}>
      {/* Logo */}
      <a href="/" className="inline-flex items-center p-2 mr-4">
        <img src={logo} width="48" height="48" alt="Logo" />
        <span className="text-xl font-bold text-teal-900">Eventos</span>
      </a>

      {/* Botón para el menú móvil */}
      <div className="flex md:hidden">
        <button onClick={toggleMenu} id="hamburger">
          <img
            className={`toggle ${menuOpen ? "hidden" : "block"}`}
            src="https://img.icons8.com/fluent-systems-regular/2x/menu-squared-2.png"
            width="48"
            height="48"
            alt="Open menu"
          />
          <img
            className={`toggle ${menuOpen ? "block" : "hidden"}`}
            src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png"
            width="48"
            height="48"
            alt="Close menu"
          />
        </button>
      </div>

      {/* Links de navegación */}
      <div
        className={`toggle ${menuOpen ? "block" : "hidden"
          } w-full md:w-auto md:flex text-right text-bold mt-5 md:mt-0 border-t-2 border-teal-900 md:border-none`}
      >
        <a
          href="/"
          className="block md:inline-block text-teal-900 hover:text-teal-500 px-3 py-3 border-b-2 border-teal-900 md:border-none md:mr-4"
        >
          Inicio
        </a>
        <a
          href="/events-list"
          className="block md:inline-block text-teal-900 hover:text-teal-500 px-3 py-3 border-b-2 border-teal-900 md:border-none md:mr-4"
        >
          Eventos
        </a>

        {/* Condición para mostrar links según isLoggin */}
        {isLoggin ? (
          <>
            <a
              href="/create"
              className="block md:inline-block text-teal-900 hover:text-teal-500 px-3 py-3 border-b-2 border-teal-900 md:border-none md:mr-4"
            >
              Crear Evento
            </a>
            <button
              onClick={handleLogout}
              className="block md:inline-block text-teal-900 hover:text-teal-500 px-3 py-3 border-b-2 border-teal-900 md:border-none md:mr-4"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            {/* Botón de "Registrar" y "Iniciar Sesión" para pantallas grandes */}
            <div className={`toggle ${menuOpen ? "block" : "hidden"} w-full md:w-auto md:flex justify-end`}>
              {!isLoggin ? (
                <>
                  <a
                    href="/register"
                    className="block md:flex w-full md:w-auto px-4 py-2 mt-4 md:mt-0 text-right bg-teal-900 hover:bg-teal-500 text-white md:rounded mb-4 md:mb-0 md:mr-4"
                  >
                    Crear Cuenta
                  </a>
                  <a
                    href="/login"
                    className="block md:flex w-full md:w-auto px-4 py-2 mt-4 md:mt-0 text-right bg-indigo-700 hover:bg-indigo-500 text-white md:rounded"
                  >
                    Iniciar Sesión
                  </a>
                </>
              ) : null}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
