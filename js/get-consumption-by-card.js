document.getElementById('openCardModalButton').addEventListener('click', () => {
    document.getElementById('cardModal-').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
});

function closeModals() {
    document.getElementById('cardModal-').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Evento para capturar envio do formulário
document.getElementById('cardForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const cardNumber = document.getElementById('cardInput').value.trim();
    if (cardNumber === "") {
        alert("Por favor, insira um número de cartão válido.");
        return;
    }

    await fetchAndDisplayConsumption(cardNumber);
});

// Função para buscar consumo por número do cartão
async function fetchConsumptionByCard(cardNumber) {
    const url = `https://24cb-190-89-153-9.ngrok-free.app/consumption/get-consumption-by-card?card=${cardNumber}`;
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'accept': 'application/json',
                'ngrok-skip-browser-warning': '6024'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar os dados: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Erro ao obter os dados:', error);
        alert('Erro ao buscar consumo.');
        throw error;
    }
}

// Função para exibir os dados na tabela
async function fetchAndDisplayConsumption(cardNumber) {
    try {
        const consumptionData = await fetchConsumptionByCard(cardNumber);

        const productMap = {
            1: 'Água Mineral',
            2: 'Refrigerante Lata',
            3: 'Suco Natural',
            4: 'Café Expresso',
            5: 'Vinho Suave',
            6: 'Heineken',
            7: 'Sanduíche Natural',
            8: 'Salada Caesar',
            9: 'Prato Executivo (Carne)',
            10: 'Prato Executivo (Frango)',
            11: 'Prato Executivo (Vegetariano)',
            12: 'Sobremesa (Pudim)',
            13: 'Sobremesa (Mousse de Chocolate)'
        };

        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        if (consumptionData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">Nenhum consumo encontrado.</td></tr>';
            return;
        }

        consumptionData.forEach(entry => {
            entry.products.forEach(product => {
                const row = document.createElement('tr');
                const productName = productMap[product.productId] || `Produto ID: ${product.productId}`;
                row.innerHTML = `
                    <td>${formatDate(entry.dateConsumption)}</td>
                    <td>${productName} (x${product.quantity})</td>
                    <td>R$ ${product.price.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            });
        });

    } catch (error) {
        console.error('Erro ao obter os dados:', error);
        alert('Erro ao buscar consumo.');
    }
}

// Função de formatação de data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}