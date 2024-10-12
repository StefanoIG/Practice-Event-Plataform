import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Inicializar SweetAlert2 con React
const MySwal = withReactContent(Swal);

interface Event {
  id: number;
  nombreEvento: string;
  description: string;
  date: string;
  time: string;
  maxGuests: number;
  imageUrl: string;
  idUsuario: string;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el id del evento desde la URL
  const [event, setEvent] = useState<Event | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Obtener el id del usuario (asumimos que se guarda en localStorage cuando se loguea)
    const storedUserId = localStorage.getItem("idUsuario");
    const isLoggedIn = localStorage.getItem("isLoggin");
    
    if (storedUserId && isLoggedIn) {
      setUserId(storedUserId);
    }

    // Obtener los eventos desde localStorage
    const storedEvents = JSON.parse(localStorage.getItem("eventos") || "[]");
    const foundEvent = storedEvents.find(
      (event: Event) => event.id === parseInt(id || "", 10)
    );

    if (foundEvent) {
      setEvent(foundEvent); // Guardamos el evento encontrado en el estado
    }

    // Verificar si el usuario ya está registrado en este evento
    const storedAsistencias = JSON.parse(localStorage.getItem("asistencias") || "[]");
    const alreadyRegistered = storedAsistencias.some(
      (asistencia: { eventId: number; userId: string }) =>
        asistencia.eventId === parseInt(id || "", 10) && asistencia.userId === storedUserId
    );

    setIsAlreadyRegistered(alreadyRegistered);
  }, [id]);

  // Función para manejar la asistencia al evento
  const handleAsistirClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggin");

    if (!isLoggedIn) {
      // Mostrar alerta de error si el usuario no está logueado
      MySwal.fire({
        title: "Error",
        text: "Debes iniciar sesión para registrar tu asistencia.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    MySwal.fire({
      title: "¿Estás seguro de que quieres asistir al evento?",
      showCancelButton: true,
      confirmButtonText: "Sí, asistir",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        // Mostrar un efecto de carga
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 2000);
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Guardar la asistencia en localStorage
        const storedAsistencias = JSON.parse(localStorage.getItem("asistencias") || "[]");
        const newAsistencia = {
          id: Date.now(), // Generamos una ID única
          eventId: event?.id,
          userId,
        };

        // Agregar la nueva asistencia
        const updatedAsistencias = [...storedAsistencias, newAsistencia];
        localStorage.setItem("asistencias", JSON.stringify(updatedAsistencias));

        // Actualizar el estado para deshabilitar el botón de asistir
        setIsAlreadyRegistered(true);

        // Mostrar mensaje de éxito
        MySwal.fire({
          title: "¡Registrado!",
          text: "Te has registrado para asistir al evento.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  if (!event) {
    return <p className="text-center text-gray-500">Evento no encontrado.</p>;
  }

  return (
    <div>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      <div className=" py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            {/* Imagen del evento */}
            <div className="md:flex-1 px-4">
              <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                <img
                  className="w-full h-full object-cover"
                  src={event.imageUrl}
                  alt={`Imagen del evento ${event.nombreEvento}`}
                />
              </div>
            </div>

            {/* Detalles del evento */}
            <div className="md:flex-1 px-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {event.nombreEvento}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {event.description}
              </p>

              <div className="flex mb-4">
                <div className="mr-4">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Fecha:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {" "}
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Hora:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {" "}
                    {event.time}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Capacidad máxima:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {" "}
                  {event.maxGuests}
                </span>
              </div>

              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Creador:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {" "}
                  {event.idUsuario}
                </span>
              </div>

              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Descripción del evento:
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  {event.description}
                </p>
              </div>
              <br />
              <div className="flex -mx-2 mb-4">
                {/* Deshabilitar botón si el usuario ya está registrado */}
                <div className="w-1/2 px-2">
                  <button
                    onClick={handleAsistirClick}
                    className={`w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700 ${
                      isAlreadyRegistered ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={isAlreadyRegistered}
                  >
                    {isAlreadyRegistered ? "Ya estás en la lista" : "Asistir"}
                  </button>
                </div>
                <div className="w-1/2 px-2">
                  <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
