// src/components/Catalogo/CarrinhoSidebar.jsx
import React, { useState } from 'react';
import { useCarrinho } from './CarrinhoContext';
import styles from './Catalogo.module.css';
import ModalCheckout from '../modalcheckout';

const CarrinhoItem = ({ item, onRemover, onAtualizarQuantidade }) => {
  const handleDiminuir = () => {
    if (item.quantidade > 1) {
      onAtualizarQuantidade(item.id, item.quantidade - 1);
    }
  };

  const handleAumentar = () => {
    onAtualizarQuantidade(item.id, item.quantidade + 1);
  };

  const handleInputChange = (e) => {
    const novaQuantidade = parseInt(e.target.value);
    if (!isNaN(novaQuantidade) && novaQuantidade > 0) {
      onAtualizarQuantidade(item.id, novaQuantidade);
    }
  };

  return (
    <div className={styles.carrinhoItem}>
      <img src={item.imagem} alt={item.nome} />

      <div className={styles.itemInfo}>
        <h4>{item.nome}</h4>
        <p className={styles.precoUnitario}>
          R$ {(item.preco || 0).toFixed(2).replace('.', ',')}
        </p>
      </div>

      <div className={styles.quantidadeControle}>
        <button 
          className={styles.btnQuantidade}
          onClick={handleDiminuir}
          disabled={item.quantidade <= 1}
        >
          −
        </button>
        
        <input
          type="number"
          className={styles.inputQuantidade}
          value={item.quantidade}
          onChange={handleInputChange}
          min="1"
          max="99"
        />
        
        <button 
          className={styles.btnQuantidade}
          onClick={handleAumentar}
        >
          +
        </button>
      </div>

      <div className={styles.subtotal}>
        R$ {((item.preco || 0) * item.quantidade).toFixed(2).replace('.', ',')}
      </div>

      <button
        className={styles.btnRemover}
        onClick={() => onRemover(item.id)}
        title="Remover item"
      >
        🗑️
      </button>
    </div>
  );
};

const CarrinhoSidebar = ({ isAberto, onFechar }) => {
  const { carrinho, removerItem, calcularTotal, mensagemAviso, atualizarQuantidade,limparCarrinho } = useCarrinho();
  const [modalCheckoutAberto, setModalCheckoutAberto] = useState(false);

  if (!isAberto) return null;

  return (
    <div className={styles.carrinhoSidebar}>
      <div className={styles.carrinhoHeader}>
        <h3>Carrinho de Compras</h3>
        <button onClick={onFechar}>✕</button>
      </div>

      {mensagemAviso && (
        <div className={styles.avisoDuplicado}>
          {mensagemAviso}
        </div>
      )}

      <div className={styles.carrinhoItens}>
        {carrinho.length === 0 ? (
          <p className={styles.carrinhoVazio}>Carrinho vazio</p>
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
          <div className={styles.resumo}>
            <span className={styles.totalItens}>
              {carrinho.reduce((acc, item) => acc + item.quantidade, 0)} itens
            </span>
            <div className={styles.total}>
              <span>Total:</span>
              <strong>R$ {calcularTotal().toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>
          <button 
            className={styles.btnFinalizar} 
            onClick={() => setModalCheckoutAberto(true)}

          >
            Finalizar Pedido
          </button>
          <span className={styles.limparCarrinho} onClick={limparCarrinho}>Limpar Carrinho</span>
        </div>
      )}
     
      {/* Renderiza o modal */}
      <ModalCheckout
        isOpen={modalCheckoutAberto}
        onClose={() => setModalCheckoutAberto(false)}
        carrinho={carrinho}
        total={calcularTotal()}
      />
    </div>
  );
};

export default CarrinhoSidebar;