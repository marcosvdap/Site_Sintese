import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CarrinhoProvider, useCarrinho } from '../../Components/catalogo/CarrinhoContext';
import FiltrosBusca from '../../Components/catalogo/FiltrosBusca';
import ProdutoCard from '../../Components/catalogo/ProdutoCard';
import CarrinhoSidebar from '../../Components/catalogo/CarrinhoSidebar';
import { useProdutos } from '../../Components/catalogo/useProdutos';
import logo from './SINTESE_MARCA-1.png';
import styles from './catalogo.module.css'; // <-- import CSS Module

const CatalogoContent = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [busca, setBusca] = useState('');
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const { totalItens } = useCarrinho();

  const { produtos, loading, error, filtrarProdutos, obterCategorias } = useProdutos();

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando produtos...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Erro: {error}</div>;

  const produtosFiltrados = filtrarProdutos(produtos, filtroCategoria, busca);
  const categorias = obterCategorias(produtos);

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        
          <img src={logo} alt="sintese" />
     
        <h1>Catálogo de Produtos</h1>
        <p>Os melhores produtos de biotecnologia das melhores marcas mundiais</p>
      </div>

      <div className={styles.content}>
        <nav className={styles.breadcrumb}>
          <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', color: '#ccc' }}>›</span>
          <span style={{ color: '#666' }}>Catálogo</span>
        </nav>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statBoxValue}>{produtosFiltrados.length}</div>
            <div className={styles.statBoxLabel}>Produtos</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statBoxValue}>{categorias.length - 1}</div>
            <div className={styles.statBoxLabel}>Fabricantes</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statBoxValue}>{totalItens || 0}</div>
            <div className={styles.statBoxLabel}>No Carrinho</div>
          </div>
        </div>

        <button
          className={styles.carrinhoButton}
          onClick={() => setCarrinhoAberto(!carrinhoAberto)}
        >
          🛒 Carrinho
        </button>

        <FiltrosBusca
          busca={busca}
          setBusca={setBusca}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          categorias={categorias}
        />

        {produtosFiltrados.length === 0 ? (
          <div className={styles.emptyMessage}>
            {produtos.length === 0 ? 'Carregando produtos...' :
              `Nenhum produto encontrado para "${busca}" na categoria "${filtroCategoria}"`}
            <br />
            <small>Total de produtos: {produtos.length} | Filtrados: {produtosFiltrados.length}</small>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
              Mostrando {produtosFiltrados.length} de {produtos.length} produtos
            </div>
            <div className={styles.grid}>
              {produtosFiltrados.map(produto => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  abrirCarrinho={setCarrinhoAberto}
                />
              ))}
            </div>
          </>
        )}

        <CarrinhoSidebar
          isAberto={carrinhoAberto}
          onFechar={() => setCarrinhoAberto(false)}
        />
      </div>
    </div>
  );
};

const Catalogo = () => (
  <CarrinhoProvider>
    <CatalogoContent />
  </CarrinhoProvider>
);

export default Catalogo;
