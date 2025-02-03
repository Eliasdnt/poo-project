// // Declarando cada variável separadamente
// const name = "João Silva";
// const email = "joao@example.com";
// const password = "senha_segura";
// const role = 1;

// // Montando o objeto de dados conforme a API espera
const data = {
 "email": "teste@gmail.com",
  "password": "teste"
}

const url = "https://2080-190-89-153-12.ngrok-free.app/login"; //correto   /https://link/campodaapi que quero consumir

const headers = {
  "Content-Type": "application/json"
};

async function enviarDados() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    console.log("Resposta da API:", result);
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
  }
}

enviarDados();
