// src/Components/catalogo/ProdutoCard.jsx - VERSÃO CORRIGIDA
import React from 'react';
import { useCarrinho } from './CarrinhoContext';

const ProdutoCard = ({ produto }) => {
  console.log('🔍 ProdutoCard renderizando:', produto); // Debug
  
  const { adicionarItem } = useCarrinho();

  if (!produto) {
    console.log('❌ ProdutoCard: produto não definido');
    return <div>Produto não encontrado</div>;
  }

  const handleAdicionar = () => {
    console.log('➕ Adicionando produto:', produto.nome);
    adicionarItem(produto);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #eee',
      transition: 'transform 0.2s',
      height: 'fit-content' // Importante!
    }}>
      <img 
        src={produto.imagem || 'https://via.placeholder.com/300x200/cccccc/white?text=Sem+Imagem'} 
        alt={produto.nome}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '12px',
          display: 'block' // Importante!
        }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200/cccccc/white?text=Erro+Imagem';
        }}
      />
      
      <h3 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '18px',
        color: '#333',
        lineHeight: '1.2'
      }}>
        {produto.nome}
      </h3>
      
      <p style={{ 
        color: '#667eea', 
        fontSize: '12px', 
        margin: '0 0 8px 0',
        textTransform: 'uppercase',
        fontWeight: 'bold'
      }}>
        {produto.categoria}
      </p>
      
      <p style={{ 
        color: '#666', 
        fontSize: '14px', 
        margin: '0 0 16px 0',
        lineHeight: '1.4'
      }}>
        {produto.descricao}
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
      </div>
      
      <button
        style={{
          width: '100%',
          padding: '12px 10px',
          background: produto.estoque > 0 ? '#667eea' : '#cccccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: produto.estoque > 0 ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
          fontSize: '14px',
          transition: 'background 0.2s'
        }}
        onClick={handleAdicionar}
        disabled={!produto.estoque || produto.estoque === 0}
        onMouseOver={(e) => {
          if (produto.estoque > 0) {
            e.target.style.background = '#5a6fd8';
          }
        }}
        onMouseOut={(e) => {
          if (produto.estoque > 0) {
            e.target.style.background = '#667eea';
          }
        }}
      >
        {!produto.estoque || produto.estoque === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
      </button>
    </div>
  );
};

export default ProdutoCard;