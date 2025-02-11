async function fetchAndDisplayConsumption() {
    const url = 'https://f8b3-177-14-232-8.ngrok-free.app/consumption/get-all'; // Substitua pela URL correta da API
    const token = localStorage.getItem('authToken');

    // Mapeamento de IDs para nomes de produtos
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
        data.forEach(consumption => {
            consumption.products.forEach(product => {
                const row = document.createElement('tr');
                const productName = productMap[product.productId] || `Produto ID: ${product.productId}`;
                row.innerHTML = `
                    <td>${formatDate(consumption.dateConsumption)}</td>
                    <td>${productName} (x${product.quantity})</td>
                    <td>R$ ${product.price.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            });
        });

    } catch (error) {
        console.error('Erro ao obter os dados:', error);
    }
}

// Função para formatar a data no formato DD/MM/AAAA HH:MM
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Chama a função para carregar os dados assim que a página for carregada
document.addEventListener('DOMContentLoaded', fetchAndDisplayConsumption);