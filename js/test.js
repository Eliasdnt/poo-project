async function getGuest() {
    const url = 'https://7d8f-190-89-153-9.ngrok-free.app/guestflow/get-guest';
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        console.error('Token de autenticação não encontrado. Faça login novamente.');
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            console.error('401 Unauthorized: Token inválido ou expirado.');
            localStorage.removeItem('authToken');
            window.location.href = '/login'; // Ajuste o caminho conforme necessário
            return;
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', data);
        return data; // Retorna os dados para uso externo

    } catch (error) {
        console.log( error); // Exibe o objeto de erro completo
         // Propaga o erro para quem chamar a função
    }
}

// Exemplo de uso:
getGuest()
    .then(data => console.log('Dados recebidos:', data))
    .catch(error => console.error('Falha:', error));
