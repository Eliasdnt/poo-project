//async function sync datas and API

const API_URL = "http://192.168.1.100:5000"; // IP da máquina onde está a API

async function fetchData() {
  try {
    const response = await fetch(`${API_URL}/dados`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Erro ao conectar com a API:\n ", error);
  }
}

fetchData();
