const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

// Chave secreta - em produção use variável de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'sintese_bio_secret_key_2024';



// Rota de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  // Buscar usuário no banco
  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Atualizar último login
      db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '4h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    }
  );
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Rota para verificar se token é válido
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Rota para alterar senha (protegida)
router.post('/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Senhas são obrigatórias' });
  }

  db.get(
    'SELECT * FROM users WHERE id = ?',
    [userId],
    async (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
      }

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      db.run(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar senha' });
          }
          res.json({ success: true, message: 'Senha alterada com sucesso' });
        }
      );
    }
  );
});

module.exports = { router, verifyToken };

// ========================================
// ATUALIZAÇÃO DO SERVER.JS
// Backend/server.js (adicione estas linhas)
/*
const { router: authRouter, verifyToken } = require('./auth');

// Adicione após os middlewares existentes:
app.use('/api/auth', authRouter);

// Proteja as rotas de produtos para POST, PUT e DELETE:
app.post('/api/produtos', verifyToken, (req, res, next) => {
  // Sua lógica de criar produto
});

app.put('/api/produtos/:id', verifyToken, (req, res, next) => {
  // Sua lógica de atualizar produto
});

app.delete('/api/produtos/:id', verifyToken, (req, res, next) => {
  // Sua lógica de deletar produto
});
*/
