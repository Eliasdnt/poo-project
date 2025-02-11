async function fetchConsumptionByCPF(cpf) {
    const url = `https://4f02-190-89-153-6.ngrok-free.app/guestflow/get-guest-by-cpf?cpf=${cpf}`;
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '6024'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar os dados: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao obter os dados:', error);
      throw error;
    }
  }

  // Função para buscar os dados pela API e exibi-los na tabela
  async function fetchAndDisplayConsumption(cpf) {
    try {
      const guestData = await fetchConsumptionByCPF(cpf);


      // Seleciona o corpo da tabela e limpa dados anteriores
      const tableBody = document.getElementById('table-body');
      tableBody.innerHTML = '';

      // Para cada convidado, cria uma linha na tabela
      guestData.forEach(guest => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${guest.accessAreaName}</td>
        <td>${guest.guestName}</td>
         
        `;
        tableBody.appendChild(row);
      });

    } catch (error) {
      console.error('Erro ao obter os dados:', error);
      alert('Erro ao buscar os dados. Verifique o console para mais detalhes.');
    }
  }

  // Função para formatar a data no formato DD/MM/AAAA HH:MM
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  // Lógica para abrir o modal ao clicar no botão
  document.getElementById('openModalButton').addEventListener('click', () => {
    const modal = document.getElementById('cpfModal');
    modal.style.display = 'block';
  });

  // Lógica para buscar os dados quando o usuário clicar no botão de busca
  document.getElementById('searchButton').addEventListener('click', () => {
    const cpf = document.getElementById('cpfInput').value;
    if (!cpf || !/^\d+$/.test(cpf)) {
      alert('Por favor, insira um CPF válido (apenas números).');
      return;
    }

    // Fecha o modal
    document.getElementById('cpfModal').style.display = 'none';

    // Busca e exibe os dados na tabela
    fetchAndDisplayConsumption(cpf);
  });