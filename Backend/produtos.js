const express = require('express');
const router = express.Router();
const db = require('./database');

// GET - Listar todos os produtos
router.get('/', (req, res) => {
  const { categoria, busca } = req.query;
  
  let sql = 'SELECT * FROM produtos WHERE 1=1';
  const params = [];
  
  if (categoria && categoria !== 'todos') {
    sql += ' AND categoria = ?';
    params.push(categoria);
  }
  
  if (busca) {
    sql += ' AND (nome LIKE ? OR descricao LIKE ?)';
    params.push(`%${busca}%`, `%${busca}%`);
  }
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET - Buscar produto por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    res.json(row);
  });
});

// POST - Criar novo produto
router.post('/', (req, res) => {
  const { nome, categoria, preco, descricao, imagem, estoque, marca } = req.body;
  
  if (!nome || !categoria || !preco) {
    res.status(400).json({ error: 'Nome, categoria e preço são obrigatórios' });
    return;
  }
  
  const sql = `
    INSERT INTO produtos (nome, categoria, preco, descricao, imagem, estoque, marca) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [nome, categoria, preco, descricao, imagem, estoque || 0, marca], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Buscar o produto criado
    db.get('SELECT * FROM produtos WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json(row);
    });
  });
});

// PUT - Atualizar produto
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, categoria, preco, descricao, imagem, estoque, marca } = req.body;
  
  const sql = `
    UPDATE produtos 
    SET nome = ?, categoria = ?, preco = ?, descricao = ?, 
        imagem = ?, estoque = ?, marca = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [nome, categoria, preco, descricao, imagem, estoque, marca, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    
    // Buscar o produto atualizado
    db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    });
  });
});

// PATCH - Atualizar estoque
router.patch('/:id/estoque', (req, res) => {
  const { id } = req.params;
  const { estoque } = req.body;
  
  if (estoque === undefined) {
    res.status(400).json({ error: 'Estoque é obrigatório' });
    return;
  }
  
  const sql = 'UPDATE produtos SET estoque = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  
  db.run(sql, [estoque, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    
    db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    });
  });
});

// DELETE - Deletar produto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM produtos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    
    res.json({ message: 'Produto deletado com sucesso', id });
  });
});

module.exports = router;