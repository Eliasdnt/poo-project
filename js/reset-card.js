document.getElementById('resetCardButton').addEventListener('click', async () => {
    const url = 'https://f8b3-177-14-232-8.ngrok-free.app/reset-card';
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao resetar o cartão: ${response.status}`);
        }

        if(response.ok)
            alert('Cartão resetado com sucesso!');
    } catch (error) {
        console.error('Erro ao resetar o cartão:', error);
        alert('Erro ao resetar o cartão. Verifique o console para mais detalhes.');
    }
});