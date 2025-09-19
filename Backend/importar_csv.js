// importar-produtos-csv.js
// Script simples para importar apenas os dados que estão no CSV

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Configurações
const csvPath = './PLANILHA - PLANILHA.csv (1).csv'; // Ajuste o caminho do CSV
const dbPath = '../Backend/produtos.db'; // Ajuste o caminho do banco

// Conectar ao banco existente
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado ao banco SQLite existente');
});

// Função para importar produtos do CSV
function importarProdutos() {
  const produtos = [];
  
  console.log('📂 Lendo arquivo CSV...\n');
  
  // Ler o arquivo CSV
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
      // Pegar apenas os campos que existem no CSV
      produtos.push({
        nome: row.NOME,
        categoria: row.categoria, // IDT, BIORAD BRASIL, etc
        codigo_fabricante: row.codigo_fabricante || '',
        preco: parseFloat(row.valor) || 0,
        descricao: row.descricao || '',
        imagem: null // Não tem no CSV, então deixa null
      });
    })
    .on('end', () => {
      console.log(`✅ ${produtos.length} produtos lidos do CSV\n`);
      
      // Inserir cada produto no banco
      let inseridos = 0;
      let erros = 0;
      
      produtos.forEach((produto, index) => {
        const sql = `
          INSERT INTO produtos (nome, categoria, codigo_fabricante,preco, descricao, imagem) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
          produto.nome,
          produto.categoria,
          produto.codigo_fabricante,
          produto.preco,
          produto.descricao,
          produto.imagem
        ], function(err) {
          if (err) {
            console.error(`❌ Erro ao inserir "${produto.nome}":`, err.message);
            erros++;
          } else {
            console.log(`✅ Inserido: ${produto.nome} - R$ ${produto.preco}`);
            inseridos++;
          }
          
          // Se for o último item, mostrar resumo
          if (index === produtos.length - 1) {
            setTimeout(() => {
              console.log('\n' + '='.repeat(50));
              console.log('📊 RESUMO DA IMPORTAÇÃO:');
              console.log(`   ✅ Produtos inseridos: ${inseridos}`);
              console.log(`   ❌ Erros: ${erros}`);
              console.log(`   📦 Total processado: ${produtos.length}`);
              console.log('='.repeat(50) + '\n');
              
              // Fechar conexão
              db.close((err) => {
                if (err) {
                  console.error('Erro ao fechar banco:', err.message);
                } else {
                  console.log('✅ Conexão fechada. Importação concluída!');
                }
              });
            }, 500);
          }
        });
      });
    })
    .on('error', (err) => {
      console.error('❌ Erro ao ler arquivo CSV:', err.message);
      db.close();
    });
}

// Executar importação
importarProdutos();