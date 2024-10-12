import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import logo from "../../../assets/logo.png";

const MySwal = withReactContent(Swal);

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Obtener los registros del localStorage
    const registros = JSON.parse(localStorage.getItem("registroData") || "[]");

    // Comprobar si existe un usuario con el mismo username y password
    const usuarioExistente = registros.find(
      (registro: any) =>
        registro.correo === username && registro.contrasena === password
    );

    if (usuarioExistente) {
      MySwal.fire({
        icon: "success",
        title: "Login Exitoso",
        text: `Bienvenido, ${usuarioExistente.nombre}!`,
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      // Aquí puedes redirigir a la página principal, por ejemplo
      setTimeout(() => {
        //Crear en LocalStorage un isLoggin
        localStorage.setItem("isLoggin", "true");
        //Crear una variable donde se guarde la ide del usuario logueado
        localStorage.setItem("idUsuario", usuarioExistente.id);

        window.location.href = "/events-list"; // Asumiendo que tienes una ruta /home
      }, 2000);
    } else {
      MySwal.fire({
        icon: "error",
        title: "Error de Login",
        text: "Usuario o contraseña incorrectos",
      });
    }
  };

  // Función para manejar el modal de "Olvidaste tu contraseña"
  const handleForgotPassword = async () => {
    const { value: email } = await MySwal.fire({
      title: "Recuperar Contraseña",
      input: "email",
      inputPlaceholder: "Ingresa tu correo",
      showCancelButton: true,
      confirmButtonText: "Recuperar",
      cancelButtonText: "Cancelar",
    });

    if (email) {
      setIsLoading(true);

      setTimeout(() => {
        // Simulación de búsqueda en localStorage
        const registros = JSON.parse(
          localStorage.getItem("registroData") || "[]"
        );
        const usuarioExistente = registros.find(
          (registro: any) => registro.correo === email
        );

        setIsLoading(false);

        if (usuarioExistente) {
          MySwal.fire({
            icon: "success",
            title: "Correo enviado",
            text: `Se ha enviado un enlace de recuperación a ${email}`,
          });
        } else {
          MySwal.fire({
            icon: "error",
            title: "Correo no encontrado",
            text: `No existe una cuenta registrada con el correo ${email}`,
          });
        }
      }, 2000); // Simulación de "loading" de 2 segundos
    }
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
      <div className="flex h-screen ">
        
        <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">
          <header>
            <img
              className="w-20 mx-auto mb-5"
              src={logo}
              alt="Logo"
            />
          </header>
          <form onSubmit={handleLogin}>
            {/* Username */}
            <div>
              <label className="block mb-2 text-indigo-500" htmlFor="username">
                Username
              </label>
              <input
                className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Correo electrónico"
              />
            </div>
            {/* Password */}
            <div>
              <label className="block mb-2 text-indigo-500" htmlFor="password">
                Password
              </label>
              <input
                className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
            </div>
            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"
              >
                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
          <footer className="flex justify-between">
            <button
              className="text-indigo-700 hover:text-pink-700 text-sm"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
            <a className="text-indigo-700 hover:text-pink-700 text-sm" href="/register">
              Create Account
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
