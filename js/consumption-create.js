const token = localStorage.getItem('authToken');

function openModal() {
  document.getElementById('mainModal').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

// function closeModals() {
//   document.getElementById('mainModal').style.display = 'none';
//   document.getElementById('overlay').style.display = 'none';
// }

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
  // Obtém o formulário pela ID
  const form = document.getElementById('consumoForm');

  // Adiciona um listener para o evento de submit do formulário
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de recarregar a página

    // Recupera os valores dos inputs
    const cardNumberValue = document.getElementById('cardNumberes').value;
    const productIdValue = document.getElementById('productIde').value;
    const quantityValue = document.getElementById('quantity').value;

    // Validação simples para verificar se os valores são numéricos
    if (isNaN(cardNumberValue) || isNaN(productIdValue) || isNaN(quantityValue)) {
      alert('Valores inválidos. Certifique-se de inserir números válidos.');
      return;
    }

    // Cria o objeto conforme o formato esperado pelo servidor
    const formData = {
      cardNumber: cardNumberValue,
      products: [
        {
          productId: productIdValue,
          quantity: quantityValue
        }
      ],
      payment: 1
    };

    try {
      console.log('Enviando dados:', JSON.stringify(formData));
      // Envia os dados para o servidor
      const response = await sendData(formData);
      // Exibe o modal com a resposta
      showResponseModal(formData);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar dados');
    }
  });
});

// Função que envia os dados para o servidor via fetch
async function sendData(formData) {
  try {
    const response = await fetch('https://f8b3-177-14-232-8.ngrok-free.app/consumption/create-consumption', {
      method: 'POST',
      headers: {
        // Caso a variável "token" esteja definida, adiciona o header de autorização
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '6024'
      },
      body: JSON.stringify(formData)
    });

    console.log('Status HTTP:', response.status);
    closeModals();

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Erro retornado pelo servidor:', errorMessage);
      throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Falha no envio:', error);
    throw error;
  }
}

// // Função para exibir os dados enviados em um modal
// function showResponseModal(data) {
//   const modal = document.getElementById('responseModal');
//   const product = data.products[0];
//   // Obtém o nome do produto a partir do select (assumindo que o select tenha id "productId")
//   const productSelect = document.getElementById('productId');
//   const productName = productSelect.options[productSelect.selectedIndex].text;

//   modal.innerHTML = `
//     <h2>Registro Enviado</h2>
//     <p><strong>Cartão:</strong> ${data.cardNumber}</p>
//     <p><strong>Produto:</strong> ${productName} (ID: ${product.productId})</p>
//     <p><strong>Quantidade:</strong> ${product.quantity}</p>
//     <p><strong>Pagamento:</strong> Cartão de Crédito</p>
//     <button onclick="closeModals()">Fechar</button>
//   `;
//   modal.style.display = 'block';
// }

document.addEventListener("DOMContentLoaded", () => {
  const cancelarButton = document.getElementById("cancelarButton");
  const mainModal = document.getElementById("mainModal");

  cancelarButton.addEventListener("click", () => {
    mainModal.style.display = "none";
  });
});
