document.getElementById('openGuestModalButton').addEventListener('click', () => {
    document.getElementById('guestModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
});

function closeGuestModal() {
    document.getElementById('guestModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}


document.getElementById('guestForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const cardNumber = document.getElementById('cardInput').value.trim();
    if (cardNumber === "") {
        alert("Por favor, insira um número de cartão válido.");
        return;
    }

    await fetchAndDisplayGuests(cardNumber);
});


async function fetchGuestsByCard(cardNumber) {
    const url = `https://fcd1-190-89-153-9.ngrok-free.app/guestflow/get-guest-by-card?card=${cardNumber}`;
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
        alert('Erro ao buscar hóspedes.');
        throw error;
    }
}


async function fetchAndDisplayGuests(cardNumber) {
    try {
        const guestData = await fetchGuestsByCard(cardNumber);
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; 
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
        alert('Erro ao buscar hóspedes.');
    }
}