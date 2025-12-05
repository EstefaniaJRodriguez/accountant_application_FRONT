const API_URL = "https://accountant-application.onrender.com/api";

export async function apiGet(path) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("Error en la petición");
  }

  return res.json();
}
