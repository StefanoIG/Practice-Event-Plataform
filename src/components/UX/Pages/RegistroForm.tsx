import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Configuración de SweetAlert2
const MySwal = withReactContent(Swal);

// Interfaz para los datos del formulario
interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  repetirContrasena: string;
  cedula: string;
  telefono: string;
}

const RegistroForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    repetirContrasena: "",
    cedula: "",
    telefono: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false); // Estado de carga del botón

  // Regex para validaciones estándar
  const regex = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Solo letras y espacios
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, // Email válido
    contrasena: /^.{6,12}$/, // Contraseña entre 6 y 12 caracteres
    telefono: /^\d{7,10}$/, // Teléfono entre 7 y 10 dígitos
  };

  // Función para validar cédula ecuatoriana
  const validarCedulaEcuatoriana = (cedula: string): boolean => {
    if (cedula.length !== 10) return false;
    const digitoRegion = parseInt(cedula.substring(0, 2));
    if (digitoRegion < 1 || digitoRegion > 24) return false;

    const ultimoDigito = parseInt(cedula.substring(9, 10));
    let sumaPares = 0;
    let sumaImpares = 0;

    for (let i = 0; i < 9; i++) {
      const digito = parseInt(cedula.charAt(i));
      if (i % 2 === 0) {
        const resultado = digito * 2;
        sumaImpares += resultado > 9 ? resultado - 9 : resultado;
      } else {
        sumaPares += digito;
      }
    }

    const sumaTotal = sumaPares + sumaImpares;
    const decenaSuperior = Math.ceil(sumaTotal / 10) * 10;
    const digitoValidador = decenaSuperior - sumaTotal;

    return digitoValidador === ultimoDigito;
  };

  // Verificar si la cédula ya está registrada en localStorage
  const isCedulaDuplicada = (cedula: string): boolean => {
    const registros = JSON.parse(localStorage.getItem("registroData") || "[]");
    return registros.some((registro: FormData) => registro.cedula === cedula);
  };

  // Manejo de cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Validar campos individualmente
  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "cedula" && !validarCedulaEcuatoriana(value)) {
      error = "Cédula ecuatoriana inválida.";
    } else if (
      regex[name as keyof typeof regex] &&
      !regex[name as keyof typeof regex].test(value)
    ) {
      error = `Formato de ${name} inválido.`;
    }

    if (value.trim() === "") {
      error = `El campo ${name} no puede estar vacío.`;
    }

    setErrors({ ...errors, [name]: error });
  };

  // Función de envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar que no haya errores antes de enviar
    let hasErrors = false;
    Object.keys(formData).forEach((key) => {
      if (errors[key] || formData[key as keyof FormData].trim() === "") {
        hasErrors = true;
        validateField(key, formData[key as keyof FormData]);
      }
    });

    if (hasErrors) {
      console.log("No se puede enviar, hay errores");
      console.log(errors);
      return;
    }
    //verificar correo duplicado
    if (localStorage.getItem("registroData")) {
        const registros = JSON.parse(localStorage.getItem("registroData") || "[]");
        const correoDuplicado = registros.some(
            (registro: FormData) => registro.correo === formData.correo
        );
        if (correoDuplicado) {
            MySwal.fire({
            icon: "error",
            title: "Correo duplicado",
            text: "Este correo ya está registrado. Por favor, usa uno diferente.",
            });
            return;
        }
        }
    // Verificar cédula duplicada
    if (isCedulaDuplicada(formData.cedula)) {
      MySwal.fire({
        icon: "error",
        title: "Cédula duplicada",
        text: "Esta cédula ya está registrada. Por favor, usa una diferente.",
      });
      return;
    }

    // Simulación de carga
    setIsLoading(true);
    setTimeout(() => {
      // Generar ID único y agregarlo al registro
      const nuevoId = Date.now().toString(); // Crear ID único
      const nuevoRegistro = { ...formData, id: nuevoId };

      // Guardar en localStorage excepto el campo repetirContrasena
      const { repetirContrasena, ...dataToStore } = nuevoRegistro;
      const registrosPrevios = JSON.parse(
        localStorage.getItem("registroData") || "[]"
      );
      localStorage.setItem(
        "registroData",
        JSON.stringify([...registrosPrevios, dataToStore])
      );

      // Mensaje de éxito con SweetAlert2
      MySwal.fire({
        icon: "success",
        title: "¡Registro Exitoso!",
        text: "Tu cuenta ha sido creada. Redirigiendo a la página de inicio de sesión...",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setIsLoading(false);

      // Redirigir al inicio de sesión después de 3 segundos
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }, 2000);
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

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onInput={handleInputChange}
              className={`w-full p-2 border ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              } rounded`}
              placeholder="Nombre"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm">{errors.nombre}</p>
            )}
          </div>
          <div>
            <label className="block">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onInput={handleInputChange}
              className={`w-full p-2 border ${
                errors.apellido ? "border-red-500" : "border-gray-300"
              } rounded`}
              placeholder="Apellido"
            />
            {errors.apellido && (
              <p className="text-red-500 text-sm">{errors.apellido}</p>
            )}
          </div>
        </div>

        {/* Correo */}
        <div>
          <label className="block">Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onInput={handleInputChange}
            className={`w-full p-2 border ${
              errors.correo ? "border-red-500" : "border-gray-300"
            } rounded`}
            placeholder="Correo electrónico"
          />
          {errors.correo && (
            <p className="text-red-500 text-sm">{errors.correo}</p>
          )}
        </div>

        {/* Contraseña y Repetir Contraseña */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onInput={handleInputChange}
              className={`w-full p-2 border ${
                errors.contrasena ? "border-red-500" : "border-gray-300"
              } rounded`}
              placeholder="Contraseña"
            />
            {errors.contrasena && (
              <p className="text-red-500 text-sm">{errors.contrasena}</p>
            )}
          </div>
          <div>
            <label className="block">Repetir Contraseña</label>
            <input
              type="password"
              name="repetirContrasena"
              value={formData.repetirContrasena}
              onInput={handleInputChange}
              className={`w-full p-2 border ${
                formData.repetirContrasena !== formData.contrasena
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded`}
              placeholder="Repite tu contraseña"
            />
            {formData.repetirContrasena !== formData.contrasena && (
              <p className="text-red-500 text-sm">
                Las contraseñas no coinciden.
              </p>
            )}
          </div>
        </div>

        {/* Cédula y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onInput={handleInputChange}
              className={`w-full p-2 border ${
                errors.cedula ? "border-red-500" : "border-gray-300"
              } rounded`}
              placeholder="Cédula"
            />
            {errors.cedula && (
              <p className="text-red-500 text-sm">{errors.cedula}</p>
            )}
          </div>
          <div>
            <label className="block">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onInput={handleInputChange}
              className={`w-full p-2 border ${
                errors.telefono ? "border-red-500" : "border-gray-300"
              } rounded`}
              placeholder="Número de teléfono"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm">{errors.telefono}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`animate-bounce focus:animate-none hover:animate-none inline-flex text-md font-medium bg-indigo-900 mt-3 px-4 py-2 rounded-lg tracking-wide text-white ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default RegistroForm;
