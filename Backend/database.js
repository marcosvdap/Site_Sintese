const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criar/conectar ao banco SQLite
const db = new sqlite3.Database(path.join(__dirname, 'produtos.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('✅ Conectado ao banco SQLite');
    initDatabase();
  }
});

// Criar tabelas se não existirem
function initDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      codigo_fabricante TEXT,
      preco REAL NOT NULL,
      descricao TEXT,
      imagem TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
    } else {
      console.log('✅ Tabela produtos pronta');
      verificarEPopular();
    }
  });
}

// Popular com dados iniciais se estiver vazia
function verificarEPopular() {
  db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
    if (err) {
      console.error('Erro ao verificar produtos:', err);
      return;
    }

    if (row.count === 0) {
      console.log('📝 Populando banco com dados iniciais...');
      popularDadosIniciais();
    } else {
      console.log(`📊 Banco já contém ${row.count} produtos`);
    }
  });
}

function popularDadosIniciais() {
  const produtos = [
    {
      nome: "Kit de Extração de DNA",
      categoria: "IDT",
      Codigo_fabricante: "Bases",
      preco: 450.00,
      descricao: "Kit completo para extração de DNA de alta qualidade",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=DNA+Kit",
    },
    {
      nome: "Nucletiodeos Modificados",
      categoria: "OMEGA BIO TEK",
      Codigo_fabricante: "Bases",
      preco: 450.00,
      descricao: "Kit completo para extração de DNA de alta qualidade",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=DNA+Kit",
    },
    {
      nome: "desenvolvimento licenciamento",
      categoria: "IDT",
      Codigo_fabricante: "Bases",
      preco: 450.00,
      descricao: "Kit completo para extração de DNA de alta qualidade",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=DNA+Kit",
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO produtos (nome, categoria, codigo_fabricante ,preco, descricao, imagem) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  produtos.forEach(produto => {
    stmt.run(
      produto.nome,
      produto.categoria,
      produto.Codigo_fabricante ,
      produto.preco,
      produto.descricao,
      produto.imagem,
    );
  });

  stmt.finalize();
  console.log('✅ Dados iniciais inseridos com sucesso!');
}

module.exports = db;