async function fetchAndDisplayGuests() {
    const url = 'https://5c16-190-89-153-6.ngrok-free.app/guestflow/get-guest'; // Substitua pela URL correta da API
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning': '6024'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar os dados: ${response.status}`);
        }

        const data = await response.json();

        // Seleciona o corpo da tabela
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

        // Percorre os dados e cria linhas na tabela
        data.forEach(guest => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${guest.accessAreaName}</td>
                <td>${guest.guestName}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro ao obter os dados:', error);
    }
}

// Chama a função para carregar os dados assim que a página for carregada
document.addEventListener('DOMContentLoaded', fetchAndDisplayGuests);
