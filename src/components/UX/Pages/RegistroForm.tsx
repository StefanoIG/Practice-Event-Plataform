import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import logo from "../../../assets/logo.png";

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
    nombre: /^[a-zA-ZÀ-ÿ\s]*$/, // Solo letras y espacios
    apellido: /^[a-zA-ZÀ-ÿ\s]*$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, // Email válido
    contrasena: /^.{6,12}$/, // Contraseña entre 6 y 12 caracteres
    telefono: /^\d*$/, // Solo números
    cedula: /^\d*$/,   // Solo números
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

  // Verificar si el correo ya está registrado en localStorage
  const isCorreoDuplicado = (correo: string): boolean => {
    const registros = JSON.parse(localStorage.getItem("registroData") || "[]");
    return registros.some((registro: FormData) => registro.correo === correo);
  };

  // Manejo de cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validar y limpiar el campo si es necesario
    let cleanValue = value;

    // Para nombre y apellido: Solo letras y espacios
    if (name === "nombre" || name === "apellido") {
      cleanValue = cleanValue.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""); // Elimina números o caracteres especiales
      if (value !== cleanValue) {
        setErrors({ ...errors, [name]: "Solo se permiten letras y espacios." });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }

    // Para cédula y teléfono: Solo números
    if (name === "cedula" || name === "telefono") {
      cleanValue = cleanValue.replace(/\D/g, ""); // Elimina cualquier cosa que no sea un número
      if (value !== cleanValue) {
        setErrors({ ...errors, [name]: "Solo se permiten números." });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }

    setFormData({ ...formData, [name]: cleanValue });
    validateField(name, cleanValue);
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

    // Verificar correo duplicado
    if (isCorreoDuplicado(formData.correo)) {
      MySwal.fire({
        icon: "error",
        title: "Correo duplicado",
        text: "Este correo ya está registrado. Por favor, usa uno diferente.",
      });
      return;
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
      // Guardar el registro en localStorage
      const nuevoId = Date.now().toString(); // Crear ID único
      const nuevoRegistro = { ...formData, id: nuevoId };

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
        text: "Tu cuenta ha sido creada.",
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
      <div className="h-full">
        <div className="mx-auto">
          <div className="flex justify-center px-6 py-12">
            <div className="w-full xl:w-3/4 lg:w-11/12 flex">
              {/* Imagen de la izquierda */}
              <div
                className="w-full h-auto bg-gray-400 dark:bg-gray-800 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg flex items-center justify-center"
                style={{
                  backgroundImage: `url(${logo})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></div>

              {/* Formulario */}
              <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
                <h3 className="py-4 text-2xl text-center text-gray-800 dark:text-white">
                  ¡Registra tu cuenta!
                </h3>
                <form
                  className="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4 md:flex md:justify-between">
                    <div className="mb-4 md:mr-2 md:mb-0">
                      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                        Nombre
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                          errors.nombre
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Nombre"
                      />
                      {errors.nombre && (
                        <p className="text-xs italic text-red-500">
                          {errors.nombre}
                        </p>
                      )}
                    </div>
                    <div className="md:ml-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                        Apellido
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                          errors.apellido
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        name="apellido"
                        type="text"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        placeholder="Apellido"
                      />
                      {errors.apellido && (
                        <p className="text-xs italic text-red-500">
                          {errors.apellido}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                      Correo
                    </label>
                    <input
                      className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                        errors.correo ? "border-red-500" : "border-gray-300"
                      }`}
                      name="correo"
                      type="email"
                      value={formData.correo}
                      onChange={handleInputChange}
                      placeholder="Correo electrónico"
                    />
                    {errors.correo && (
                      <p className="text-xs italic text-red-500">
                        {errors.correo}
                      </p>
                    )}
                  </div>

                  <div className="mb-4 md:flex md:justify-between">
                    <div className="mb-4 md:mr-2 md:mb-0">
                      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                        Contraseña
                      </label>
                      <input
                        className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                          errors.contrasena
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        name="contrasena"
                        type="password"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        placeholder="******************"
                      />
                      {errors.contrasena && (
                        <p className="text-xs italic text-red-500">
                          {errors.contrasena}
                        </p>
                      )}
                    </div>
                    <div className="md:ml-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                        Repetir Contraseña
                      </label>
                      <input
                        className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                          formData.repetirContrasena !== formData.contrasena
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        name="repetirContrasena"
                        type="password"
                        value={formData.repetirContrasena}
                        onChange={handleInputChange}
                        placeholder="******************"
                      />
                      {formData.repetirContrasena !==
                        formData.contrasena && (
                        <p className="text-xs italic text-red-500">
                          Las contraseñas no coinciden.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 md:flex md:justify-between">
                    <div className="mb-4 md:mr-2 md:mb-0">
                      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                        Cédula
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                          errors.cedula
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        name="cedula"
                        type="text"
                        value={formData.cedula}
                        onChange={handleInputChange}
                        placeholder="Cédula"
                      />
                      {errors.cedula && (
                        <p className="text-xs italic text-red-500">
                          {errors.cedula}
                        </p>
                      )}
                    </div>
                    <div className="md:ml-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                        Teléfono
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                          errors.telefono
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        name="telefono"
                        type="text"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Teléfono"
                      />
                      {errors.telefono && (
                        <p className="text-xs italic text-red-500">
                          {errors.telefono}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6 text-center">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registrando..." : "Registrar Cuenta"}
                    </button>
                  </div>

                  <hr className="mb-6 border-t" />
                  <div className="text-center">
                    <a
                      className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                      href="./login"
                    >
                      ¿Ya tienes una cuenta? ¡Inicia Sesión!
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroForm;
