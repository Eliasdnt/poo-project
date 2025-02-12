const token = localStorage.getItem('authToken');

function openModal() {
  document.getElementById('mainModal').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}


document.addEventListener('DOMContentLoaded', () => {
 
  const form = document.getElementById('consumoForm');

  
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    
    const cardNumberValue = document.getElementById('cardNumberes').value;
    const productIdValue = document.getElementById('productIde').value;
    const quantityValue = document.getElementById('quantity').value;

    
    if (isNaN(cardNumberValue) || isNaN(productIdValue) || isNaN(quantityValue)) {
      alert('Valores inválidos. Certifique-se de inserir números válidos.');
      return;
    }

  
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
  });
});


async function sendData(formData) {
  try {
    const response = await fetch('https://fcd1-190-89-153-9.ngrok-free.app/consumption/create-consumption', {
      method: 'POST',
      headers: {
        
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



document.addEventListener("DOMContentLoaded", () => {
  const cancelarButton = document.getElementById("cancelarButton");
  const mainModal = document.getElementById("mainModal");

  cancelarButton.addEventListener("click", () => {
    mainModal.style.display = "none";
  });
});
