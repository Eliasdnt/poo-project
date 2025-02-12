document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("myModal");
  const openModalButton = document.getElementById("openModalDiasble");
  const closeButton = document.getElementById("closebutton");
  const sendButton = document.getElementById("sendButton");
  const cardForm = document.getElementById("cardForm");
 
  const cardNumberInput = document.getElementById("cardNumber");


  openModalButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

 
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });


  cardForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    
    const cardNumber = cardNumberInput.value.trim();
    if (!cardNumber) {
      alert("O campo do número do cartão não pode estar vazio!");
      return;
    }

    console.log("Card Number:", cardNumber);

    try {
  
      sendButton.disabled = true;
      sendButton.textContent = "Enviando...";

      
      const url = "https://fcd1-190-89-153-9.ngrok-free.app/guest/disable-guest";
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          // "Authorization": `Bearer ${token}`, // descomente se necessário
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

      // Fecha o modal
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
