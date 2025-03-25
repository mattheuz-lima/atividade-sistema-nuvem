const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Mantenha apenas esta linha no início

require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB com sucesso!');
}).catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
});

// Inicializa o servidor
const app = express();
app.use(bodyParser.json()); // Permite processar JSON no corpo da requisição
app.use(cors()); // Permite comunicação entre front-end e back-end

// Modelo do Usuário
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

// ROTA PARA CADASTRAR O USUÁRIO NO BANCO DE DADOS MONGO DB
app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save(); // Salva no banco de dados
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ROTA PARA VERIFICAR DADOS CADASTRADOS E PERMITIR LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Dados recebidos no login:", { email, password });

  try {
    // Verifica se o usuário existe com o e-mail fornecido
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuário não encontrado para o e-mail:", email);
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    console.log("Usuário encontrado no banco:", user);

    // Compara a senha fornecida com a senha no banco
    if (user.password !== password) {
      console.log("Senha incorreta para o e-mail:", email);
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    console.log("Login bem-sucedido para o e-mail:", email);

    // Gera o token JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no login. Tente novamente!' });
  }
});

// ROTA PARA DELETAR USUARIO LOGADO 
// app.delete: Define a rota DELETE que recebe o userId.
// findByIdAndDelete: Exclui o usuário no banco com base no userId.

app.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);  // Exclui pelo userId
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ message: 'Erro ao excluir usuário. Tente novamente!' });
  }
});


// ROTA PARA ATUALIZAR OS DADOS CADASTRADOS NO BANCO DE DADOS
// Recebe o userId na URL (/users/:userId).
// Recebe os novos dados (name, email, password) do req.body.
// Usa o findByIdAndUpdate para atualizar o usuário no banco de dados.
// Retorna o usuário atualizado ou uma mensagem de erro se algo der errado.

app.put('/users/:userId', async (req, res) => {
  const { userId } = req.params;  // Pega o userId da URL
  const { name, email, password } = req.body;  // Pega os novos dados enviados pelo frontend

  try {
    // Atualiza o usuário no banco de dados pelo userId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password },  // Campos a serem atualizados
      { new: true }  // Retorna o documento atualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Dados atualizados com sucesso!', user: updatedUser });  // Resposta de sucesso
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);  // Log de erro no terminal
    res.status(500).json({ message: 'Erro ao atualizar os dados. Tente novamente!' });
  }
});


// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});