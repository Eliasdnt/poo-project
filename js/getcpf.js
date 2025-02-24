
async function fetchConsumptionByCPF(cpf) {
    const url = `https://fcd1-190-89-153-9.ngrok-free.app/consumption/get-consumption-by-guest?cpf=${cpf}`;
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

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Erro ao obter os dados:', error);
        throw error;
    }
}


async function fetchAndDisplayConsumption(cpf) {
    try {
        const guestData = await fetchConsumptionByCPF(cpf);

       
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
        guestData.forEach(guest => {
            guest.products.forEach(product => {
                const row = document.createElement('tr');
                const productName = productMap[product.productId] || `Produto ID: ${product.productId}`;
                row.innerHTML = `
                    <td>${formatDate(guest.dateConsumption)}</td>
                    <td>${productName} (x${product.quantity})</td>
                    <td>R$ ${product.price.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            });
        });

    } catch (error) {
        console.error('Erro ao obter os dados:', error);
        alert('Erro ao buscar os dados. Verifique o console para mais detalhes.');
    }
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}


document.getElementById('openModalButton').addEventListener('click', () => {
    const modal = document.getElementById('cpfModal');
    modal.style.display = 'block';
});

document.getElementById('searchButton').addEventListener('click', () => {
    const cpf = document.getElementById('cpfInput').value;
    if (!cpf || !/^\d+$/.test(cpf)) {
        alert('Por favor, insira um CPF válido (apenas números).');
        return;
    }

    const modal = document.getElementById('cpfModal');
    modal.style.display = 'none'; 

    fetchAndDisplayConsumption(cpf); 
});