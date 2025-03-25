// Função para alternar o menu suspenso
function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Função para editar perfil
function editarPerfil() {
    alert("Redirecionando para a edição de perfil...");
    window.location.href = "/pagina-captura/atualizarDados.html";  // Redireciona para tela de Atualizar dados
}

// FUNÇÃO PARA DELETAR USUARIO LOGADO - ENVIA A REQUISIÇÃO DELETE PARA O BACKEND

async function excluirUsuario() {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        const token = localStorage.getItem("authToken");  // Recupera o token JWT
        const decoded = decodificarToken(token);
        const userId = decoded.userId;  // Pega o userId do token

        try {
            const response = await axios.delete(`http://localhost:3000/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                alert("Usuário excluído com sucesso!");
                localStorage.removeItem("authToken");  // Remove o token do localStorage
                window.location.href = "/pagina-captura/cadastro.html";  // Redireciona para o cadastro
            }
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            alert("Erro ao excluir usuário. Tente novamente!");
        }
    }
}


// O login.js deve estar salvando o token JWT no localStorage

//  Decodificar o token JWT e exibir o e-mail do usuário.

// Função para decodificar o token JWT
function decodificarToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function exibirEmailUsuario() {
    const token = localStorage.getItem("authToken");
    if (token) {
        const decoded = decodificarToken(token);
        const email = decoded.email;  // Agora temos o email no token
        const userMenu = document.querySelector('.user-menu');
        const emailDisplay = document.createElement('p');
        emailDisplay.textContent = `Bem-vindo, ${email}!`;
        emailDisplay.classList.add('email-usuario');  // Classe para estilizar
        userMenu.appendChild(emailDisplay);

    }
}


exibirEmailUsuario();