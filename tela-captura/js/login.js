
// Este arquivo vai capturar os dados do formulário de Login e enviá-los ao backend.
/*Explicações do Código JavaScript:
Captura dos dados do formulário: O código captura os valores dos campos email e password do formulário.
Envio para o backend: Utiliza axios.post para enviar os dados para a rota /login no backend.
Armazenamento do token: Se o login for bem-sucedido, o token JWT gerado pelo backend será armazenado no
localStorage.
Redirecionamento: Após o login bem-sucedido, o usuário será redirecionado para a página /pagina-protegida.html (que você pode substituir pelo destino desejado).*/ 

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Impede o envio normal do formulário

    // Captura os dados do formulário
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Envia os dados para o backend (ajuste a URL conforme necessário)
    try {
        const response = await axios.post("http://localhost:3000/login", {
            email,
            password
        });

        // Se o login for bem-sucedido, o token será armazenado
        if (response.status === 200) {
            alert("Login bem-sucedido!");
            localStorage.setItem("authToken", response.data.token);  // Salva o token no localStorage
            window.location.href = "/tela-administrativa/index.html";  // Redireciona para uma página protegida
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro ao fazer login. Verifique e tente novamente!");
    }
});
