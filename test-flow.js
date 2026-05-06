const axios = require('axios');

async function test() {
  try {
    const api = axios.create({ baseURL: 'http://localhost:3001' });
    
    // 1. Crear Empleado
    const nuevoCliente = {
      nombre: 'carlosTest',
      cedula: '12345678',
      fecha_ingreso: '2020-01-01',
      monto_liquidacion_actual: 5000,
      empresaId: 1
    };
    console.log("Creando empleado...");
    const res = await api.post('/empleados', nuevoCliente);
    console.log("Respuesta de /empleados:", res.data);
    const empleadoId = res.data.id;
    console.log("Empleado ID capturado:", empleadoId);

    // 2. Crear Usuario
    console.log("Registrando usuario...");
    const authRes = await api.post('/auth/registro', {
      username: nuevoCliente.nombre,
      password: nuevoCliente.cedula,
      rol: 'CLIENT',
      empleadoId: empleadoId
    });
    console.log("Respuesta de /auth/registro:", authRes.data);

    // 3. Crear Préstamo
    console.log("Creando préstamo...");
    const prestamoRes = await api.post('/prestamos', {
      empleadoId: empleadoId,
      costoEquipo: 100
    });
    console.log("Respuesta de /prestamos:", prestamoRes.data);

    // 4. Iniciar sesión como carlosTest
    console.log("Iniciando sesión...");
    const loginRes = await api.post('/auth/login', {
      username: nuevoCliente.nombre,
      password: nuevoCliente.cedula
    });
    const token = loginRes.data.access_token;
    console.log("Token obtenido:", token ? "Sí" : "No");

    // 5. Fetch préstamos como cliente
    console.log("Obteniendo préstamos del cliente...");
    const getRes = await api.get('/prestamos/cliente', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Préstamos obtenidos:", getRes.data);

  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}

test();
