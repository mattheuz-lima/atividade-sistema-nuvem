document.getElementById("updateForm").addEventListener("submit", async function(event) {
  event.preventDefault();  // Evita o envio padrão do formulário

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const token = localStorage.getItem("authToken");  // Recupera o token JWT
  const decoded = JSON.parse(atob(token.split('.')[1]));  // Decodifica o payload do token
  const userId = decoded.userId;  // Extrai o userId do token

  try {
    const response = await axios.put(`http://localhost:3000/users/${userId}`, {
      name,
      email,
      password
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      alert("Dados atualizados com sucesso!");
      localStorage.removeItem("authToken");  // Remove o token JWT
      window.location.href = "/pagina-captura/login.html";  // Redireciona para a página de login
    }

  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
    alert("Erro ao atualizar os dados. Tente novamente!");
  }
});