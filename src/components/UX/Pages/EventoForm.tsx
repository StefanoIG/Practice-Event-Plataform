import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Para redirigir al usuario si no está logueado

const EventForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreEvento: "",
    maxGuests: 0,
    date: "",
    time: "",
    attending: "",
    description: "",
    imageUrl: "",
    idUsuario: "", // Se agregará desde el localStorage
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Para la vista previa de la imagen
  const navigate = useNavigate(); // Para redirigir si no está logueado

  // Verificar si el usuario está logueado al cargar el componente
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggin");
    const idUsuario = localStorage.getItem("idUsuario");

    if (isLoggedIn !== "true" || !idUsuario) {
      // Redirigir a la página de login si no está logueado o falta el idUsuario
      Swal.fire({
        icon: "error",
        title: "Acceso Denegado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: true,
      }).then(() => {
        navigate("/login");
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        idUsuario: idUsuario,
      }));
    }
  }, [navigate]);

  // Manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Si cambia el URL de la imagen, actualizamos la vista previa
    if (name === "imageUrl") {
      setPreviewImage(value);
    }
  };

  // Maneja la selección de los radio buttons
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, attending: e.target.value });
  };

  // Validaciones básicas
  const validateForm = () => {
    let formIsValid = true;
    let errors: Record<string, string> = {};

    if (!formData.nombreEvento) {
      formIsValid = false;
      errors["nombreEvento"] = "El nombre del evento es requerido.";
    }

    if (formData.maxGuests <= 0) {
      formIsValid = false;
      errors["maxGuests"] =
        "La cantidad máxima de personas debe ser mayor que 0.";
    }

    if (!formData.date) {
      formIsValid = false;
      errors["date"] = "La fecha es requerida.";
    }

    if (!formData.time) {
      formIsValid = false;
      errors["time"] = "La hora es requerida.";
    }

    if (!formData.attending) {
      formIsValid = false;
      errors["attending"] = "Debe seleccionar si va a asistir.";
    }

    if (!formData.imageUrl) {
      formIsValid = false;
      errors["imageUrl"] = "La URL de la imagen es requerida.";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Guardar el evento en el localStorage
    const eventosPrevios = JSON.parse(localStorage.getItem("eventos") || "[]");
    const nuevoEvento = {
      ...formData,
      id: Date.now(), // Asignar un ID único al evento
    };

    localStorage.setItem(
      "eventos",
      JSON.stringify([...eventosPrevios, nuevoEvento])
    );

    // Mostrar alerta de éxito
    Swal.fire({
      icon: "success",
      title: "Evento Creado",
      text: "El evento ha sido creado correctamente.",
      toast: true,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    // Reiniciar el formulario
    setFormData({
      nombreEvento: "",
      maxGuests: 0,
      date: "",
      time: "",
      attending: "",
      description: "",
      imageUrl: "",
      idUsuario: formData.idUsuario, // Mantener el idUsuario
    });
    setPreviewImage(null); // Reiniciar la vista previa
  };

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
      
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[550px] ">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="nombreEvento"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Nombre del Evento
              </label>
              <input
                type="text"
                name="nombreEvento"
                id="nombreEvento"
                placeholder="Nombre del Evento"
                value={formData.nombreEvento}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors.nombreEvento && (
                <p className="text-red-500 text-sm">{errors.nombreEvento}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="imageUrl"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                URL de la Imagen del Evento
              </label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                placeholder="https://example.com/imagen.jpg"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-sm">{errors.imageUrl}</p>
              )}
            </div>

            {/* Vista previa de la imagen */}
            {previewImage && (
              <div className="mb-5">
                <img
                  src={previewImage}
                  alt="Vista previa"
                  className="w-full rounded-md object-cover h-48"
                />
              </div>
            )}

            <div className="mb-5">
              <label
                htmlFor="maxGuests"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Cantidad máxima de personas
              </label>
              <input
                type="number"
                name="maxGuests"
                id="maxGuests"
                value={formData.maxGuests}
                onChange={handleInputChange}
                placeholder="Ej: 100"
                min="1"
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors.maxGuests && (
                <p className="text-red-500 text-sm">{errors.maxGuests}</p>
              )}
            </div>

            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                    <label
                    htmlFor="date"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                    Fecha del evento
                    </label>
                    <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]} // No permitir fechas pasadas
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  {errors.date && (
                    <p className="text-red-500 text-sm">{errors.date}</p>
                  )}
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="time"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Hora del evento
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm">{errors.time}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                ¿Asistirá al evento?
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    id="radioButton1"
                    value="yes"
                    checked={formData.attending === "yes"}
                    onChange={handleRadioChange}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor="radioButton1"
                    className="pl-3 text-base font-medium text-[#07074D]"
                  >
                    Sí
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    id="radioButton2"
                    value="no"
                    checked={formData.attending === "no"}
                    onChange={handleRadioChange}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor="radioButton2"
                    className="pl-3 text-base font-medium text-[#07074D]"
                  >
                    No
                  </label>
                </div>
              </div>
              {errors.attending && (
                <p className="text-red-500 text-sm">{errors.attending}</p>
              )}
            </div>

            {/* Descripción del evento */}
            <div className="mb-5">
              <label
                htmlFor="description"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Descripción del evento
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Descripción breve del evento"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                rows={4}
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
