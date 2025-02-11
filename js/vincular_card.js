document.addEventListener('DOMContentLoaded', function() {
    // Obtém o token do localStorage
    const token = localStorage.getItem('authToken');

    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cardForm = document.getElementById('cardForm');

    // Abrir modal
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Fechar modal ao clicar no botão de fechar
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Envio do formulário
    cardForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validação do token
        if (!token) {
            alert("Usuário não autenticado. Faça login primeiro.");
            return;
        }

        // Captura e limpeza dos campos
        const cpfInput = document.getElementById('cpf').value.trim();
        const cardNumberInput = document.getElementById('cardNumber').value.trim();

        if (!cpfInput || !cardNumberInput) {
            alert("Preencha todos os campos!");
            return;
        }

        // Verifica se os valores são numéricos
        if (isNaN(cpfInput) || isNaN(cardNumberInput)) {
            alert("CPF e número do cartão devem ser números válidos!");
            return;
        }

        // Converte as entradas para números
        const cpf = Number(cpfInput);
        const cardOfNumber = Number(cardNumberInput);

        // Cria o payload a ser enviado
        const payload = { cpf: cpf, cardOfNumber: cardOfNumber };
        console.log("Payload enviado:", payload);

        // Envia a requisição para a API
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
                // Se a API retornar erro, captura o texto da resposta para debug
                return response.text().then(text => {
                    throw new Error(`HTTP error ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta da API:', data);
            // Aqui você pode acessar os dados retornados, por exemplo:
            // data.name, data.email, data.address, etc.
            // Atualize elementos na sua página ou modal conforme necessário.
            alert('Dados enviados com sucesso!');
            modal.style.display = 'none';
            cardForm.reset(); // Limpa os campos do formulário
        })
        .catch(error => {
            console.error('Erro:', error);
            alert(`Erro: ${error.message || "Falha na conexão."}`);
        });
    });
});
