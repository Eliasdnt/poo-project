document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');

    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cardForm = document.getElementById('cardForm');

    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    cardForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!token) {
            alert("Usuário não autenticado. Faça login primeiro.");
            return;
        }

        const cpfInput = document.getElementById('cpf').value.trim();
        const cardNumberInput = document.getElementById('cardNumber').value.trim();

        if (!cpfInput || !cardNumberInput) {
            alert("Preencha todos os campos!");
            return;
        }

        if (isNaN(cpfInput) || isNaN(cardNumberInput)) {
            alert("CPF e número do cartão devem ser números válidos!");
            return;
        }

        const cpf = Number(cpfInput);
        const cardOfNumber = Number(cardNumberInput);

        const payload = { cpf: cpf, cardOfNumber: cardOfNumber };
        console.log("Payload enviado:", payload);

        fetch("https://24cb-190-89-153-9.ngrok-free.app/register-card", {
            method: "POST",
            headers: { 
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
                'ngrok-skip-browser-warning': '6024'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta da API:', data);
            
            alert('Dados enviados com sucesso!');
            modal.style.display = 'none';
            cardForm.reset(); 
        })
        .catch(error => {
            console.error('Erro:', error);
            alert(`Erro: ${error.message || "Falha na conexão."}`);
        });
    });
});
