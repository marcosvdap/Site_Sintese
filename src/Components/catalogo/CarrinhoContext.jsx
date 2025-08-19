// src/components/Catalogo/CarrinhoContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const CarrinhoContext = createContext();

const carrinhoReducer = (state, action) => {
  switch (action.type) {
    case 'ADICIONAR_ITEM':
      const itemExistente = state.find(item => item.id === action.payload.id);
      if (itemExistente) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantidade: 1 }];

    case 'REMOVER_ITEM':
      return state.filter(item => item.id !== action.payload);

    case 'ATUALIZAR_QUANTIDADE':
      if (action.payload.quantidade <= 0) {
        return state.filter(item => item.id !== action.payload.id);
      }
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantidade: action.payload.quantidade }
          : item
      );

    case 'LIMPAR_CARRINHO':
      return [];

    default:
      return state;
  }
};

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, dispatch] = useReducer(carrinhoReducer, []);

  const adicionarItem = (produto) => {
    dispatch({ type: 'ADICIONAR_ITEM', payload: produto });
  };

  const removerItem = (produtoId) => {
    dispatch({ type: 'REMOVER_ITEM', payload: produtoId });
  };

  const atualizarQuantidade = (produtoId, quantidade) => {
    dispatch({ type: 'ATUALIZAR_QUANTIDADE', payload: { id: produtoId, quantidade } });
  };

  const limparCarrinho = () => {
    dispatch({ type: 'LIMPAR_CARRINHO' });
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{
      carrinho,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      calcularTotal,
      totalItens
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
};