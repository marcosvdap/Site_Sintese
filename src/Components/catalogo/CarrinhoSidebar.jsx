// src/components/Catalogo/CarrinhoSidebar.jsx
import React from 'react';
import { useCarrinho } from './CarrinhoContext';
import styles from './Catalogo.module.css';

const CarrinhoItem = ({ item, onRemover, onAtualizarQuantidade }) => {
  return (
    <div className={styles.carrinhoItem}>
      <img src={item.imagem} alt={item.nome} />
      
      <div className={styles.itemInfo}>
        <h4>{item.nome}</h4>
      </div>
      
      <button 
        className={styles.btnRemover}
        onClick={() => onRemover(item.id)}
      >
        🗑️
      </button>
    </div>
  );
};

const CarrinhoSidebar = ({ isAberto, onFechar }) => {
  const { carrinho, removerItem, atualizarQuantidade, calcularTotal } = useCarrinho();

  if (!isAberto) return null;

  return (
    <div className={styles.carrinhoSidebar}>
      <div className={styles.carrinhoHeader}>
        <h3>Carrinho de Compras</h3>
        <button onClick={onFechar}>✕</button>
      </div>

      <div className={styles.carrinhoItens}>
        {carrinho.length === 0 ? (
          <p>Carrinho vazio</p>
        ) : (
          carrinho.map(item => (
            <CarrinhoItem 
              key={item.id} 
              item={item}
              onRemover={removerItem}
              onAtualizarQuantidade={atualizarQuantidade}
            />
          ))
        )}
      </div>

      {carrinho.length > 0 && (
        <div className={styles.carrinhoFooter}>
          <div className={styles.total}>
            Total: R$ {calcularTotal().toFixed(2).replace('.', ',')}
          </div>
          <button className={styles.btnFinalizar}>
            Finalizar Pedido
          </button>
        </div>
      )}
    </div>
  );
};

export default CarrinhoSidebar;