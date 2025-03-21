const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Carrega variáveis de ambiente

const app = express();
app.use(bodyParser.json()); 
app.use(cors()); 

// Simulação de um banco de dados em memória (para testes)
const users = [];

// ROTA PARA CADASTRAR O USUÁRIO
app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ROTA PARA LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json({ message: 'E-mail ou senha inválidos' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login bem-sucedido!', token });
});

// ROTA PARA LISTAR USUÁRIOS (apenas para teste)
app.get('/users', (req, res) => {
  res.json(users);
});

// ROTA PARA DELETAR USUÁRIO
app.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const index = users.findIndex(user => user.id == userId);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  users.splice(index, 1);
  res.json({ message: 'Usuário excluído com sucesso!' });
});

// ROTA PARA ATUALIZAR USUÁRIO
app.put('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email, password } = req.body;
  const user = users.find(u => u.id == userId);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.password = password || user.password;

  res.json({ message: 'Dados atualizados com sucesso!', user });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
