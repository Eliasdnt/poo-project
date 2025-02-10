document.getElementById("employeeForm").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const name = document.getElementById("name-").value;
    const email = document.getElementById("email-").value;
    const password = document.getElementById("password-").value;
    const role = document.getElementById("role-").value;
  
    const data = {
        name: name,
        email: email,
        password: password,
        role: parseInt(role) // Convertendo para inteiro
    };
  
    const queryString = `?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(parseInt(role))}`;
  
    // Concatena a URL base com a query string
    const url = `https://f8cc-200-17-32-208.ngrok-free.app/employee/add-employee${queryString}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
           
        });
  
        const result = await response.json();
        document.getElementById("message").innerText = result.message || "Funcionário adicionado com sucesso!";
        document.getElementById("message").style.color = "green";
    } catch (error) {
        document.getElementById("message").innerText = "Erro ao adicionar funcionário.";
        document.getElementById("message").style.color = "red";
    }
  });
  