document.getElementById("signupForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Impede o envio normal do formulário

    // Captura os dados do formulário
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Envia os dados para o backend
    try {
        const response = await axios.post("http://localhost:3000/users", {
            name,
            email,
            password
        });

        // Mensagem de sucesso
        if (response.status === 201) {
            alert("Usuário cadastrado com sucesso!");
            document.getElementById("signupForm").reset();  // Limpa o formulário
            window.location.href = "/pagina-captura/login.html";  // Redireciona para a página de login
        }
        else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar usuário. Tente novamente!");
    }
});
