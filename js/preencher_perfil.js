// Recupera o email armazenado no localStorage
const storedEmail = localStorage.getItem('userEmail');

/**
 * Função que envia o email para a API e retorna os dados do usuário.
 * Altere a URL da API conforme necessário.
 *
 * @param {string} email - O email do usuário.
 */
function fetchUserData(email) {
  // Exemplo de URL (substitua pela URL real da sua API)
  const apiUrl = `https://24cb-190-89-153-9.ngrok-free.app/guest/get-guest-by-email?email=${encodeURIComponent(email)}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }
      return response.json();
    })
    .then(data => {
      populateUserInfo(data);
    })
    .catch(error => {
      console.error("Erro ao buscar os dados do usuário:", error);
    });
}

/**
 * Função que preenche o HTML com os dados do usuário.
 *
 * @param {Object} data - Objeto com os dados do usuário retornados pela API.
 */
function populateUserInfo(data) {
  document.getElementById('nome').textContent = data.name;

  // Converte e formata a data de nascimento para o padrão brasileiro
  const dateOfBirth = new Date(data.dateOfBirth);
  document.getElementById('data-nascimento').textContent = dateOfBirth.toLocaleDateString('pt-BR');

  document.getElementById('email').textContent = data.email;
  document.getElementById('endereco').textContent = data.address;
  document.getElementById('cellphone').textContent = data.cellPhone;

  // Mostra "Sim" se for titular, caso contrário "Não"
  document.getElementById('titular').textContent = data.isHolder ? "Sim" : "Não";
}

// Inicia a busca dos dados do usuário usando o email armazenado
if (storedEmail) {
  fetchUserData(storedEmail);
} else {
  console.error("Email do usuário não encontrado no localStorage.");
}
