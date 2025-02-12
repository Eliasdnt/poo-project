// =======================
// LOGIN
// =======================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.querySelector("input[name='type']:checked");

    if (!userType) {
      alert("Por favor, selecione um tipo de usuário (Colaborador ou Cliente).");
      return;
    }

    const requestBody = { email, password };
    localStorage.setItem("authToken", '');
    try {
      const response = await fetch("https://fcd1-190-89-153-9.ngrok-free.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          'ngrok-skip-browser-warning': '6024'
         },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login. Verifique suas credenciais.");
      }

      const data = await response.json(); 
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);

      console.log("Login bem-sucedido!", data);

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
// RECUPERAÇÃO DE SENHA (Forgot Password)
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  const forgotModal = document.getElementById("forgotPasswordModal");
  forgotModal.style.display = "none";

  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", function () {
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
          const response = await fetch("https://fcd1-190-89-153-9.ngrok-free.app/auth/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'ngrok-skip-browser-warning': '6024' 
            },
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
});