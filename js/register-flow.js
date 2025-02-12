function openModal() {
    document.getElementById('mainModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }

  
  function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    document.getElementById('overlay').style.display = 'none';
  }

  const token = localStorage.getItem('authToken');

  async function handleSubmit(event) {
    event.preventDefault();

    document.getElementById('mainModal').style.display = 'none';

    const formData = {
      cardOfNumber: parseInt(document.getElementById('cardOfNumber').value),
      accessAreaId: parseInt(document.getElementById('accessAreaId').value)
    };

    try {
      const responseData = await sendData(formData);
      showResponseModal(responseData, formData);
      document.getElementById('acessoForm').reset();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar dados: ' + error.message);
      openModal();
    }
  }

  async function sendData(formData) {
    try {
      const response = await fetch('https://fcd1-190-89-153-9.ngrok-free.app/guestflow/register-flow', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6024'
        },
        body: JSON.stringify(formData)
      });
      if(response.ok){
          console.log("sucesso")
      }
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Falha no envio:', error);
      throw error;
    }
  }

  function showResponseModal(apiResponse, formData) {
    const modal = document.getElementById('responseModal');
    const areaSelect = document.getElementById('accessAreaId');
    const areaName = areaSelect.options[areaSelect.selectedIndex].text;

    modal.innerHTML = `
      <h2>Acesso Registrado</h2>
      <p><strong>Cartão:</strong> ${apiResponse.cardOfNumber || formData.cardOfNumber}</p>
      <p><strong>Área:</strong> ${areaName} (ID: ${apiResponse.accessAreaId || formData.accessAreaId})</p>
      <button onclick="closeModals()">Fechar</button>
    `;

    modal.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }