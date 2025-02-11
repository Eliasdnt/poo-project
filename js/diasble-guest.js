document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("myModal");
  const openModalButton = document.getElementById("openModalDiasble");
  const closeButton = document.getElementById("closebutton");
  const sendButton = document.getElementById("sendButton");
  const cardForm = document.getElementById("cardForm");
  // Utilize o id correto do input; ajuste para "cardNumber" se esse for o id real
  const cardNumberInput = document.getElementById("cardNumber");

  // Abre o modal
  openModalButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Fecha o modal
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fecha o modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Envio do formulário
  cardForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    // Recupera e valida o valor do número do cartão
    const cardNumber = cardNumberInput.value.trim();
    if (!cardNumber) {
      alert("O campo do número do cartão não pode estar vazio!");
      return;
    }

    console.log("Card Number:", cardNumber);

    try {
      // Indica visualmente que o envio está ocorrendo
      sendButton.disabled = true;
      sendButton.textContent = "Enviando...";

      // Define a URL e realiza a requisição PATCH
      const url = "https://24cb-190-89-153-9.ngrok-free.app/guest/disable-guest";
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
      // Restaura o botão e reseta o formulário
      sendButton.disabled = false;
      sendButton.textContent = "Enviar";
      cardForm.reset();
    }
  });
});
