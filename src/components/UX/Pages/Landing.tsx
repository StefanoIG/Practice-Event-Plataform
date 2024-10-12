import React from "react";
import sitio from "../../../assets/sitio.webp";

const Index: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={sitio}
            alt="Background Image"
            className="object-cover object-center w-full h-full"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
          <h1 className="relative w-[max-content] font-mono text-2xl before:absolute before:inset-0 before:animate-typewriter before:bg-white after:absolute after:inset-0 after:w-[0.125em] after:animate-caret after:bg-black">
            El mejor sitio de eventos!
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Descubre los mejores eventos.
          </p>
          <a
            href="#features"
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Nuestras Caracteristicas
          </a>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100 text-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Nuestras Características
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="bg-indigo-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4H8l4-8v6h1v4h3l-4 8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Rendimiento Rápido</h3>
              <p className="text-gray-600">
                Nuestro sistema garantiza tiempos de carga rápidos y un
                rendimiento fluido en todos los dispositivos.
              </p>
              <a
                href="#"
                className="mt-4 inline-block bg-indigo-700 text-white py-2 px-4 rounded-full hover:bg-pink-700"
              >
                Aprende Más
              </a>
            </div>

            {/* Feature 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="bg-indigo-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7-3 7 3M5 10v4m0 0l7 3 7-3m-7-3v4m0 0v4m7-4v4M5 14l7 3 7-3"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Tecnologías Modernas</h3>
              <p className="text-gray-600">
                Construido con los últimos frameworks para garantizar la máxima
                compatibilidad y rendimiento.
              </p>
              <a
                href="#"
                className="mt-4 inline-block bg-indigo-700 text-white py-2 px-4 rounded-full hover:bg-pink-700"
              >
                Aprende Más
              </a>
            </div>

            {/* Feature 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="bg-indigo-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4H8l4-8v6h1v4h3l-4 8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Arquitectura Escalable
              </h3>
              <p className="text-gray-600">
                Nuestra plataforma está construida para escalar con las
                crecientes necesidades de tu negocio.
              </p>
              <a
                href="#"
                className="mt-4 inline-block bg-indigo-700 text-white py-2 px-4 rounded-full hover:bg-pink-700"
              >
                Aprende Más
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
