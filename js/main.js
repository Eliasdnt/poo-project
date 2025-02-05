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

  fetch("https://95c4-190-89-153-0.ngrok-free.app/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
        window.location.href = "../home_user.html";
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
  const logoutTime = 1 * 60 * 1000; // 1 minuto
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
  const email = prompt("Digite seu e-mail para redefinição de senha:");
  if (!email) {
      alert("E-mail é obrigatório!");
      return;
  }

  try {
      const response = await fetch("/auth/forgot-password", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
      });

      if (response.ok) {
          alert("Solicitação enviada com sucesso. Verifique seu e-mail.");
      } else {
          alert("Erro ao enviar solicitação. Tente novamente.");
      }
  } catch (error) {
      alert("Erro de conexão.");
      console.error(error);
  }
});