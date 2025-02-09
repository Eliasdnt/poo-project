// Recupera o token armazenado, se existir, ou define como null
let authToken = localStorage.getItem('authToken') || null;

// =======================
// LOGIN
// =======================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    localStorage.setItem('authToken', '');
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.querySelector("input[name='type']:checked");

    if (!userType) {
      alert("Por favor, selecione um tipo de usuário (Colaborador ou Cliente).");
      return;
    }

    const requestBody = { email, password };

    try {
      const response = await fetch("https://27aa-2804-d4b-9a05-2c00-4df0-cc8b-a5d0-1af6.ngrok-free.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login. Verifique suas credenciais.");
      }

      const data = await response.json();
      authToken = data.token;
      // Armazena o token para persistir entre páginas
      localStorage.setItem('authToken', authToken);
      console.log("Login bem-sucedido! Token armazenado:", authToken);

      // Redirecionamento baseado no tipo de usuário
      if (userType.value === "colaborador") {
        window.location.href = "employee_html/home.html";
        
      } else if (userType.value === "cliente") {
        window.location.href = "user_html/home_user.html";
      }
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  });
}

// =======================
// RECUPERAÇÃO DE SENHA (Forgot Password)
// =======================
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener("click", function () {
    const forgotModal = document.getElementById("forgotPasswordModal");
    if (forgotModal) {
      forgotModal.style.display = "flex";
    }
  });

  const closeModalBtn = document.getElementById("closeModal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      const forgotModal = document.getElementById("forgotPasswordModal");
      if (forgotModal) {
        forgotModal.style.display = "none";
      }
    });
  }

  const sendResetEmailBtn = document.getElementById("sendResetEmail");
  if (sendResetEmailBtn) {
    sendResetEmailBtn.addEventListener("click", async function () {
      const emailInput = document.getElementById("forgotEmail");
      if (!emailInput) {
        console.error("Elemento 'forgotEmail' não encontrado.");
        return;
      }
      const email = emailInput.value;
      if (!email) {
        alert("Por favor, insira seu e-mail.");
        return;
      }
      try {
        const response = await fetch("https://27aa-2804-d4b-9a05-2c00-4df0-cc8b-a5d0-1af6.ngrok-free.app/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('authToken')}`},
          body: JSON.stringify({ email })
        });

        if (!response.ok) {
          throw new Error("Erro ao enviar o e-mail de recuperação. Tente novamente.");
        }

        alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        const forgotModal = document.getElementById("forgotPasswordModal");
        if (forgotModal) {
          forgotModal.style.display = "none";
        }
      } catch (error) {
        alert("Falha ao enviar o e-mail: " + error.message);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('employeeForm');

  if (!form) {
      console.error('Formulário não encontrado!');
      return;
  }

  form.addEventListener('submit', async function(e) {
      e.preventDefault();
  // Captura dos valores
  const formData = {
    name: document.getElementById('name-').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    role: document.getElementById('role').value
  };

  const url = `https://27aa-2804-d4b-9a05-2c00-4df0-cc8b-a5d0-1af6.ngrok-free.app/employee/add-employee?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`;   
  
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = '';
  messageDiv.classList.remove('success', 'error');

  try {
    const response = await fetch(url, {
      method: "POST",
      // mode: 'no-cors',
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      // body: JSON.stringify(formData) // Dados enviados no corpo
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erro HTTP ${response.status}`);
    }

    console.log("Sucesso:", data);
    messageDiv.textContent = 'Usuário adicionado com sucesso!';
    messageDiv.classList.add('success');
    document.getElementById('employeeForm').reset();
    
  } catch (error) {
    console.error("Erro:", error);
    messageDiv.textContent = `Erro: ${error.message}`;
    messageDiv.classList.add('error');
  }
});

});