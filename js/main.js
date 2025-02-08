// URL base da API
const API_BASE_URL = "https://09cd-190-89-153-13.ngrok-free.app";

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validação básica
  if (!email || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, insira um email válido.");
    return;
  }

  console.log("Tentando login com:", email, password);

  const requestData = { email, password };

  fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" // Corrigido
    },
    body: JSON.stringify(requestData)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        const errorMessage = data.message || `Erro HTTP ${response.status}`;
        throw new Error(errorMessage);
      }).catch(() => {
        throw new Error(`Erro HTTP ${response.status}`);
      });
    }
    return response.json();
  })
  .then(data => {
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      window.location.href = "../user_html/home_user.html";
    } else {
      throw new Error("Login falhou: resposta incompleta do servidor.");
    }
  })
  .catch(error => {
    console.error("Erro na requisição:", error);
    alert("Erro ao fazer login: " + error.message);
  });
}

document.getElementById('loginForm').addEventListener('submit', handleLogin);

function initInactivityLogout() {
  let timeout;
  const logoutTime = 1 * 60 * 1000;
  const activityEvents = ["mousemove", "keypress", "click", "scroll"];

  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(logoutUser, logoutTime);
  };

  function logoutUser() {
    activityEvents.forEach(eventName => {
      document.removeEventListener(eventName, resetTimer);
    });
    clearTimeout(timeout);
    alert("Sessão expirada por inatividade. Você será redirecionado para a página de login.");
    localStorage.removeItem("authToken");
    window.location.href = "/index.html";
  }

  activityEvents.forEach(eventName => {
    document.addEventListener(eventName, resetTimer);
  });

  resetTimer();
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("authToken")) {
    initInactivityLogout();
  }
});
document.getElementById("forgotPasswordBtn").addEventListener("click", async () => {
  // Usando SweetAlert2 para o prompt de e-mail
  const { value: email } = await Swal.fire({
    title: 'Digite seu e-mail',
    input: 'email',
    inputPlaceholder: 'Seu e-mail',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Você precisa digitar um e-mail!';
      }
    }
  });

  if (email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao solicitar redefinição de senha.");
      }

      const data = await response.json();
      // Usando Toastr para mensagem de sucesso
      toastr.success(data.message || 'Verifique seu e-mail para redefinir a senha.');
    } catch (error) {
      console.error("Erro na requisição:", error);
      // Usando Toastr para mensagem de erro
      toastr.error(error.message || 'Ocorreu um erro ao processar sua solicitação.');
    }
  } else {
    // Usando Toastr para mensagem de aviso
    toastr.warning('E-mail não fornecido.');
  }
});

//Create Contract
async function createContract() {
  const { value: formValues } = await Swal.fire({
    title: 'Criar Contrato',
    width: '800px',
    html: `
      <div style="max-height: 70vh; overflow-y: auto; padding-right: 10px;">
        <h3>Dados do Contrato</h3>
        <input type="datetime-local" id="beginAt" class="swal2-input" required>
        <input type="datetime-local" id="finishAt" class="swal2-input" required>
        <input type="number" id="paymentId" class="swal2-input" required placeholder="ID do Pagamento">

        <h3>Titular</h3>
        <input type="text" id="holderName" class="swal2-input" required placeholder="Nome completo">
        <input type="email" id="holderEmail" class="swal2-input" required placeholder="Email">
        <input type="text" id="holderCpf" class="swal2-input" required 
               pattern="\\d{11}" placeholder="CPF (apenas números)">
        <input type="tel" id="holderCellPhone" class="swal2-input" required 
               placeholder="Celular">
        <input type="text" id="holderAddress" class="swal2-input" required placeholder="Endereço">
        <input type="date" id="holderDateOfBirth" class="swal2-input" required>
        <input type="url" id="holderPhotoUrl" class="swal2-input" placeholder="URL da Foto">
        <input type="number" id="holderRoom" class="swal2-input" placeholder="Número do Quarto">
        <input type="text" id="holderAccessAreaIds" class="swal2-input" 
               placeholder="IDs de Acesso (separados por vírgula)">

        <h3>Dependente</h3>
        <input type="text" id="dependentName" class="swal2-input" placeholder="Nome">
        <input type="email" id="dependentEmail" class="swal2-input" placeholder="Email">
        <input type="text" id="dependentCpf" class="swal2-input" 
               pattern="\\d{11}" placeholder="CPF">
        <input type="date" id="dependentDateOfBirth" class="swal2-input">
        <input type="url" id="dependentPhotoUrl" class="swal2-input" placeholder="URL da Foto">
        <input type="number" id="dependentRoom" class="swal2-input" placeholder="Número do Quarto">
        <input type="text" id="dependentAccessAreaIds" class="swal2-input" 
               placeholder="IDs de Acesso (separados por vírgula)">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    preConfirm: () => {
      try {
        // Construir objeto com todos os dados
        const params = {
          beginAt: new Date(document.getElementById('beginAt').value).toISOString(),
          finishAt: new Date(document.getElementById('finishAt').value).toISOString(),
          paymentId: document.getElementById('paymentId').value,
          holder: JSON.stringify({
            name: document.getElementById('holderName').value,
            isHolder: true,
            email: document.getElementById('holderEmail').value,
            cpf: document.getElementById('holderCpf').value,
            cellPhone: document.getElementById('holderCellPhone').value,
            address: document.getElementById('holderAddress').value,
            dateOfBirth: document.getElementById('holderDateOfBirth').value,
            photoUrl: document.getElementById('holderPhotoUrl').value,
            room: document.getElementById('holderRoom').value,
            accessAreaIds: document.getElementById('holderAccessAreaIds').value.split(',')
          }),
          dependents: JSON.stringify([{
            name: document.getElementById('dependentName').value,
            email: document.getElementById('dependentEmail').value,
            isHolder: false,
            cpf: document.getElementById('dependentCpf').value,
            dateOfBirth: document.getElementById('dependentDateOfBirth').value,
            photoUrl: document.getElementById('dependentPhotoUrl').value,
            room: document.getElementById('dependentRoom').value,
            accessAreaIds: document.getElementById('dependentAccessAreaIds').value.split(',')
          }])
        };

        // Converter para query string
        const queryParams = new URLSearchParams(params).toString();
        return queryParams;

      } catch (error) {
        Swal.showValidationMessage('Erro ao formatar dados para envio');
        return false;
      }
    }
  });

  if (formValues) {
    try {
      // Montar URL completa
      const API_URL = `https://09cd-190-89-153-13.ngrok-free.app/contract/create-contract?${formValues}`;
      
      // Enviar via GET
      const response = await fetch(API_URL);

      if (response.ok) {
        toastr.success('Dados enviados com sucesso!');
      } else {
        toastr.error('Erro no envio: ' + response.status);
      }
    } catch (error) {
      toastr.error('Falha na comunicação: ' + error.message);
    }
  }
}