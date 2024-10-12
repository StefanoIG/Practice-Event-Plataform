import React, { useEffect, useState } from 'react';

interface NavbarProps {
  links?: { name: string; path: string }[]; // Lista de enlaces con nombre y ruta, opcional
  className?: string; // Clases CSS opcionales
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isLoggin, setisLoggin] = useState(false);

  // Comprobamos el estado de `isLoggin` en localStorage cuando el componente se monta
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggin') === 'true';
    setisLoggin(loggedInStatus);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('isLoggin'); // Eliminamos el estado de "logueado"
    localStorage.removeItem('idUsuario'); // Eliminamos el ID del usuario

    setisLoggin(false); // Actualizamos el estado local
    window.location.reload(); // Recargamos la página para reflejar los cambios
  };

  return (
    <div>
      {/* Header */}
      <header className={`h-24 sm:h-32 flex items-center z-30 w-full bg-black ${className}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="uppercase text-white font-black text-3xl">
            Eventos
          </div>
          <div className="flex items-center">
            <nav className="font-sen text-white uppercase text-lg lg:flex items-center hidden">
              <a href="/" className="py-2 px-6 flex">
                Inicio
              </a>
              <a href="/events-list" className="py-2 px-6 flex">
                Sistema de Eventos
              </a>

              {/* Condición para mostrar links según isLoggin */}
              {isLoggin ? (
                <>
                  <a href="/create" className="py-2 px-6 flex">
                    Crear Evento
                  </a>
                  <button onClick={handleLogout} className="py-2 px-6 flex">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="py-2 px-6 flex">
                    Iniciar Sesión
                  </a>
                  <a href="/register" className="py-2 px-6 flex">
                    Registro
                  </a>
                </>
              )}
            </nav>
            <button className="lg:hidden flex flex-col ml-4">
              <span className="w-6 h-1 bg-white mb-1"></span>
              <span className="w-6 h-1 bg-white mb-1"></span>
              <span className="w-6 h-1 bg-white mb-1"></span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
