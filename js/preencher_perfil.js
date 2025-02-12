
const storedEmail = localStorage.getItem('userEmail');

/**
 * 
 *
 * @param {string} email - O email do usuário.
 */
function fetchUserData(email) {
  
  const apiUrl = `https://fcd1-190-89-153-9.ngrok-free.app/guest/get-guest-by-email?email=${encodeURIComponent(email)}`;

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
 * 
 *
 * @param {Object} data 
 */
function populateUserInfo(data) {
  document.getElementById('nome').textContent = data.name;

  
  const dateOfBirth = new Date(data.dateOfBirth);
  document.getElementById('data-nascimento').textContent = dateOfBirth.toLocaleDateString('pt-BR');

  document.getElementById('email').textContent = data.email;
  document.getElementById('endereco').textContent = data.address;
  document.getElementById('cellphone').textContent = data.cellPhone;

  
  document.getElementById('titular').textContent = data.isHolder ? "Sim" : "Não";
}


if (storedEmail) {
  fetchUserData(storedEmail);
} else {
  console.error("Email do usuário não encontrado no localStorage.");
}
