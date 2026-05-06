async function run() {
  try {
    const loginRes = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'tester2', password: '99999' })
    });
    const loginData = await loginRes.json();
    console.log("Token:", loginData.access_token);

    const getRes = await fetch('http://localhost:3001/prestamos/cliente', {
      headers: { Authorization: `Bearer ${loginData.access_token}` }
    });
    const prestamos = await getRes.json();
    console.log("Prestamos:", JSON.stringify(prestamos, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
