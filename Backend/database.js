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
      preco REAL NOT NULL,
      descricao TEXT,
      imagem TEXT,
      estoque INTEGER DEFAULT 0,
      marca TEXT,
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
      categoria: "Extração",
      preco: 450.00,
      descricao: "Kit completo para extração de DNA de alta qualidade",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=DNA+Kit",
      estoque: 25,
      marca: "IDT"
    },
    {
      nome: "Reagente PCR Master Mix",
      categoria: "PCR",
      preco: 320.00,
      descricao: "Mix pronto para reações de PCR",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=PCR+Mix",
      estoque: 15,
      marca: "BioLab"
    },
    {
      nome: "Primers Oligonucleotídeos",
      categoria: "Primers",
      preco: 180.00,
      descricao: "Primers customizados de alta pureza",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=Primers",
      estoque: 50,
      marca: "IDT"
    },
    {
      nome: "Kit de Clonagem",
      categoria: "Clonagem",
      preco: 680.00,
      descricao: "Kit completo para clonagem molecular",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=Clonagem",
      estoque: 8,
      marca: "Thermo"
    },
    {
      nome: "Enzimas de Restrição",
      categoria: "Enzimas",
      preco: 290.00,
      descricao: "Set de enzimas de restrição comuns",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=Enzimas",
      estoque: 30,
      marca: "NEB"
    },
    {
      nome: "Kit Sequenciamento NGS",
      categoria: "Sequenciamento",
      preco: 1250.00,
      descricao: "Kit preparação biblioteca NGS",
      imagem: "https://via.placeholder.com/300x200/667eea/white?text=NGS+Kit",
      estoque: 5,
      marca: "Illumina"
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO produtos (nome, categoria, preco, descricao, imagem, estoque, marca) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  produtos.forEach(produto => {
    stmt.run(
      produto.nome,
      produto.categoria,
      produto.preco,
      produto.descricao,
      produto.imagem,
      produto.estoque,
      produto.marca
    );
  });

  stmt.finalize();
  console.log('✅ Dados iniciais inseridos com sucesso!');
}

module.exports = db;