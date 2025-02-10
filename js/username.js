document.addEventListener("DOMContentLoaded", function () {
    const usernameElement = document.querySelector("h4#username");
    const emailElement = document.querySelector("span#useremail");
  
    // Recupera os dados armazenados no localStorage
    const storedName = localStorage.getItem("userName") || "Usuário";
    const storedEmail = localStorage.getItem("userEmail") || "usuario@email.com";
  
    // Atualiza os elementos na página
    if (usernameElement) {
      usernameElement.textContent = storedName;
    }
    if (emailElement) {
      emailElement.textContent = storedEmail;
    }
  });