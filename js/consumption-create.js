const token = localStorage.getItem('authToken');

function openModal() {
  document.getElementById('mainModal').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function closeModals() {
  document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
  document.getElementById('overlay').style.display = 'none';
}

async function handleSubmit(event) {
  event.preventDefault();

  // Recupera os valores dos inputs
  const cardNumberValue = document.getElementById('cardNumberes').value;
  const productIdValue = document.getElementById('productIde').value;
  const quantityValue = document.getElementById('quantity').value;

  // Validação dos campos obrigatórios
//   if (!cardNumberValue || !productIdValue || !quantityValue) {
//     alert('Por favor, preencha todos os campos.');
//     return;
//   }

  // Converte os valores para número

  // Verifica se a conversão foi bem-sucedida
  if (isNaN(cardNumberValue) || isNaN(productIdValue) || isNaN(quantityValue)) {
    alert('Valores inválidos. Certifique-se de inserir números válidos.');
    return;
  }

  // Cria o objeto conforme o formato que o servidor espera
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
    const response = await sendData(formData);
    showResponseModal(formData);
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    alert('Erro ao enviar dados');
  }
}

async function sendData(formData) {
  try {
    const response = await fetch('https://05f3-190-89-153-6.ngrok-free.app/consumption/create-consumption', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '6024'
      },
      body: JSON.stringify(formData)
    });

    console.log('Status HTTP:', response.status);

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

function showResponseModal(data) {
  const modal = document.getElementById('responseModal');
  const product = data.products[0];
  // Obtém o nome do produto a partir do select
  const productSelect = document.getElementById('productId');
  const productName = productSelect.options[productSelect.selectedIndex].text;

  modal.innerHTML = `
    <h2>Registro Enviado</h2>
    <p><strong>Cartão:</strong> ${data.cardNumber}</p>
    <p><strong>Produto:</strong> ${productName} (ID: ${product.productId})</p>
    <p><strong>Quantidade:</strong> ${product.quantity}</p>
    <p><strong>Pagamento:</strong> Cartão de Crédito</p>
    <button onclick="closeModals()">Fechar</button>
  `;
  modal.style.display = 'block';
}
