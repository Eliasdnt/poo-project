function employeeADD() {
    const name = "Elias";
    const email = "antoniodnt22@gmail.com";
    const password = "teste@123";
    const role = 1;

    console.log("Tentando adicionar usuário com:", name, email, password, role);

    const url = `https://95c4-190-89-153-0.ngrok-free.app/employee/add-employee?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${role}`;

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                const errorMessage = data.message || `Erro HTTP ${response.status}`;
                throw new Error(errorMessage);
            }).catch(() => {
                throw new Error(`Erro HTTP ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => console.log("Usuário adicionado com sucesso:", data))
    .catch(error => console.error("Erro ao adicionar usuário:", error));
}

employeeADD();
