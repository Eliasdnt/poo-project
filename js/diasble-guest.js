const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModalDiasble");
const closeButton = document.querySelector(".close");
const sendButton = document.getElementById("sendButton");
const cardForm = document.getElementById("cardForm");

// Abre o modal
openModalButton.addEventListener("click", () => {
  modal.style.display = "block";
});

// Fecha o modal
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fecha o modal ao clicar fora
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Envio do formulário
sendButton.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o comportamento padrão do formulário
  
  cardForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário
  
    const cardNumber = document.getElementById("cardNumbere").value.trim();
    
    if (!cardNumber) {
      alert("O campo do número do cartão não pode estar vazio!");
      return;
    }
  
    console.log("Card Number:", cardNumber);
    
    try {
      sendButton.disabled = true;
      sendButton.textContent = "Enviando...";
  
      const url = "https://05f3-190-89-153-6.ngrok-free.app/guest/disable-guest";
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
        //   "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
           'ngrok-skip-browser-warning': '6024'
        },
        body: JSON.stringify({ cardOfNumber: cardNumber })
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Resposta da API:", data);
      alert("Cartão desativado com sucesso!");
      
      modal.style.display = "none";
  
    } catch (error) {
      console.error("Erro:", error);
      alert(`Falha ao desativar cartão: ${error.message}`);
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = "Enviar";
      cardForm.reset();
    }
  });
});