function openModal() {
    document.getElementById('mainModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }

  // Fecha todos os modais e o overlay
  function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    document.getElementById('overlay').style.display = 'none';
  }

  // Recupera o token de autenticação do localStorage (garanta que ele esteja salvo com a chave 'authToken')
  const token = localStorage.getItem('authToken');

  // Função executada ao submeter o formulário de acesso
  async function handleSubmit(event) {
    event.preventDefault();

    // Opcional: esconde o modal de registro para evitar duplo envio
    document.getElementById('mainModal').style.display = 'none';

    // Prepara os dados do formulário
    const formData = {
      cardOfNumber: parseInt(document.getElementById('cardOfNumber').value),
      accessAreaId: parseInt(document.getElementById('accessAreaId').value)
    };

    try {
      // Envia os dados para a API e aguarda a resposta
      const responseData = await sendData(formData);
      // Exibe o modal de resposta com os dados retornados
      showResponseModal(responseData, formData);
      // Opcional: limpa o formulário para nova submissão
      document.getElementById('acessoForm').reset();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar dados: ' + error.message);
      // Em caso de erro, reabre o modal de registro para nova tentativa
      openModal();
    }
  }

  // Função para enviar os dados via fetch para a API
  async function sendData(formData) {
    try {
      const response = await fetch('https://f8b3-177-14-232-8.ngrok-free.app/guestflow/register-flow', {
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

  // Exibe o modal de resposta com os dados retornados pela API (caso a API não retorne os mesmos dados, os dados enviados pelo formulário são usados como fallback)
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