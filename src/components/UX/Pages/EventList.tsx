import React, { useEffect, useState } from 'react';
import EventCard from '../../UI/EventCard';

interface Event {
  nombreEvento: string;
  description: string;
  date: string;
  time: string;
  maxGuests: number;
  imageUrl: string;
  idUsuario: string;
  id: number; // Asegúrate de que cada evento tenga un ID único
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(3); // Mostrar 3 eventos por página

  // Filtros
  const [maxGuestsFilter, setMaxGuestsFilter] = useState<number | null>(null);
  const [nameFilter, setNameFilter] = useState<string>('');

  // Cargar los eventos desde el localStorage
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('eventos') || '[]');

    // Filtrar solo los eventos futuros (de hoy en adelante)
    const futureEvents = storedEvents.filter((event: Event) => new Date(event.date) >= new Date());
    
    setEvents(futureEvents);
    setFilteredEvents(futureEvents);
  }, []);

  // Filtrar eventos
  useEffect(() => {
    let filtered = [...events];

    // Filtro por cantidad máxima de personas
    if (maxGuestsFilter !== null) {
      filtered = filtered.filter(event => event.maxGuests >= maxGuestsFilter);
    }

    // Filtro por nombre del evento
    if (nameFilter) {
      filtered = filtered.filter(event => event.nombreEvento.toLowerCase().includes(nameFilter.toLowerCase()));
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reiniciar la paginación al aplicar filtros
  }, [events, maxGuestsFilter, nameFilter]);

  // Manejar el cambio de filtros
  const handleMaxGuestsFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setMaxGuestsFilter(value);
  };

  const handleNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
  };

  // Paginación: Cálculo de índices
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Total de páginas
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-8">Eventos Futuros</h2>

      {/* Filtros mejorados */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg flex flex-wrap justify-between space-y-4 md:space-y-0 md:flex-row">
        {/* Filtro por cantidad máxima de personas */}
        <div className="w-full md:w-1/2">
          <label htmlFor="maxGuestsFilter" className="block text-lg mb-2">
            Máx. personas:
          </label>
          <input
            type="number"
            id="maxGuestsFilter"
            placeholder="Ej. 50"
            className="border border-gray-300 rounded py-2 px-4 w-full"
            onChange={handleMaxGuestsFilter}
          />
        </div>

        {/* Filtro por nombre del evento */}
        <div className="w-full md:w-1/2">
          <label htmlFor="nameFilter" className="block text-lg mb-2">
            Nombre del evento:
          </label>
          <input
            type="text"
            id="nameFilter"
            placeholder="Buscar por nombre"
            className="border border-gray-300 rounded py-2 px-4 w-full"
            onChange={handleNameFilter}
          />
        </div>
      </div>

      {/* Renderizado de eventos */}
      <div className="flex flex-wrap justify-center">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <EventCard
              key={event.id} // Pasamos el id real
              id={event.id}  // Aseguramos que el id del evento se pase correctamente
              nombreEvento={event.nombreEvento}
              description={event.description}
              date={event.date}
              time={event.time}
              maxGuests={event.maxGuests}
              imageUrl={event.imageUrl}
              idUsuario={event.idUsuario}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No hay eventos disponibles según los filtros aplicados.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === page ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;
