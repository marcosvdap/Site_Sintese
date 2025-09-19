import React from 'react';
import { useCarrinho } from './CarrinhoContext';

const ProdutoCard = ({ produto, abrirCarrinho }) => {
  const { adicionarItem } = useCarrinho();

  if (!produto) return <div>Produto não encontrado</div>;

  const handleAdicionar = () => {
    const sucesso = adicionarItem(produto); // agora retorna true/false
    if (!sucesso) {
      alert('Item já foi adicionado ao carrinho!');
      return;
    }
    abrirCarrinho(true); // abre o sidebar somente se adicionou
  };


  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #eee',
      transition: 'transform 0.2s',
      height: 'fit-content'
    }}>
      <img
        src={produto.imagem }
        alt={produto.nome}
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px', display: 'block' }}
        onError={(e) => { e.target.src = '/Imagens/produtos/placeholder.png'; }}
      />

      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333', lineHeight: '1.2' }}>
        {produto.nome}
      </h3>

      <p style={{ color: '#667eea', fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {produto.categoria}
      </p>

      <p style={{ color: '#666', fontSize: '14px', margin: '0 0 16px 0', lineHeight: '1.4' }}>
        {produto.descricao}
      </p>
      {/* Preço estilizado como dinheiro */}
      <p style={{
        color: '#444',
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 16px 16px', // recuo à esquerda
        lineHeight: '1.4'
      }}>
        R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
      </p>


      <button
        style={{
          width: '100%',
          padding: '12px 10px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '14px',
          transition: 'background 0.2s'
        }}
        onClick={handleAdicionar}

        onMouseOver={(e) => { e.target.style.background = '#5a6fd8'; }}
        onMouseOut={(e) => { e.target.style.background = '#667eea'; }}
      >
        {'Adicionar ao Carrinho'}
      </button>
    </div>
  );
};

export default ProdutoCard;
