// src/pages/Catalogo/index.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CarrinhoProvider, useCarrinho } from '../../Components/catalogo/CarrinhoContext';
import FiltrosBusca from '../../Components/catalogo/FiltrosBusca';
import ProdutoCard from '../../Components/catalogo/ProdutoCard';
import CarrinhoSidebar from '../../Components/catalogo/CarrinhoSidebar';
import {useProdutos} from '../../Components/catalogo/useProdutos';

// Componente interno que usa o Context
const CatalogoContent = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [busca, setBusca] = useState('');
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  
  const { produtos, loading, error, filtrarProdutos, obterCategorias } = useProdutos();
  const { totalItens } = useCarrinho();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div>Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        Erro: {error}
      </div>
    );
  }

  const produtosFiltrados = filtrarProdutos(produtos, filtroCategoria, busca);
  const categorias = obterCategorias(produtos);

  // Debug - adicione estas linhas para verificar
  console.log('Produtos:', produtos);
  console.log('Produtos filtrados:', produtosFiltrados);
  console.log('Categorias:', categorias);
  console.log('Filtro categoria:', filtroCategoria);
  console.log('Busca:', busca);

  const containerStyle = {
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: '20px'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
    marginBottom: '30px',
    borderRadius: '8px'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  const carrinhoButtonStyle = {
    position: 'fixed',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '15px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    zIndex: 999,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };

  return (
    <div style={containerStyle}>
      {/* Header da Página */}
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '42px' }}>Catálogo de Produtos</h1>
        <p style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>
          Mais de 3.000 produtos de biotecnologia das melhores marcas mundiais
        </p>
      </div>

      <div style={contentStyle}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '20px', fontSize: '14px' }}>
          <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', color: '#ccc' }}>›</span>
          <span style={{ color: '#666' }}>Catálogo</span>
        </nav>

        {/* Estatísticas */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px', 
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            textAlign: 'center', 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            minWidth: '120px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {produtosFiltrados.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
              Produtos
            </div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            minWidth: '120px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {categorias.length - 1}
            </div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
              Categorias
            </div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            minWidth: '120px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {totalItens}
            </div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
              No Carrinho
            </div>
          </div>
        </div>

        {/* Botão Carrinho Fixo */}
        <button 
          style={carrinhoButtonStyle}
          onClick={() => setCarrinhoAberto(!carrinhoAberto)}
        >
          🛒 Carrinho ({totalItens})
        </button>

        {/* Filtros e Busca */}
        <FiltrosBusca
          busca={busca}
          setBusca={setBusca}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          categorias={categorias}
        />

  {/* Grid de Produtos */}
{produtosFiltrados.length === 0 ? (
  <div style={{ 
    textAlign: 'center', 
    padding: '60px 20px', 
    color: '#666',
    fontSize: '18px',
    background: 'white',
    borderRadius: '8px'
  }}>
    {produtos.length === 0 ? 
      'Carregando produtos...' : 
      `Nenhum produto encontrado para "${busca}" na categoria "${filtroCategoria}"`
    }
    <br/>
    <small style={{ color: '#999', fontSize: '14px' }}>
      Total de produtos: {produtos.length} | Filtrados: {produtosFiltrados.length}
    </small>
  </div>
) : (
  <>
    <div style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
      Mostrando {produtosFiltrados.length} de {produtos.length} produtos
    </div>
    <div style={gridStyle}>
      {produtosFiltrados.map(produto => (
        <ProdutoCard key={produto.id} produto={produto} />
      ))}
    </div>
  </>
)}

        {/* Carrinho Lateral */}
        <CarrinhoSidebar 
          isAberto={carrinhoAberto}
          onFechar={() => setCarrinhoAberto(false)}
        />
      </div>
    </div>
  );
};

// Componente principal exportado com Provider
const Catalogo = () => {
  return (
    <CarrinhoProvider>
      <CatalogoContent />
    </CarrinhoProvider>
  );
};

export default Catalogo;