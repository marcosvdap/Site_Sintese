// src/components/Catalogo/CarrinhoContext.jsx
import React, { createContext, useContext, useReducer, useState } from 'react';

const CarrinhoContext = createContext();

const carrinhoReducer = (state, action) => {
  switch (action.type) {
    case 'ADICIONAR_ITEM':
      const itemExistente = state.find(item => item.id === action.payload.id);
      if (itemExistente) {
        return state;
      }
      return [...state, { ...action.payload, quantidade: 1 }];

    case 'REMOVER_ITEM':
      return state.filter(item => item.id !== action.payload);

    case 'LIMPAR_CARRINHO':
      return [];

    default:
      return state;
  }
};

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, dispatch] = useReducer(carrinhoReducer, []);
  const [mensagemAviso, setMensagemAviso] = useState('');
  const [sidebarAberto, setSidebarAberto] = useState(false); // NOVO


  const adicionarItem = (produto) => {
    const existe = carrinho.find(item => item.id === produto.id);
    if (existe) {
      setMensagemAviso('Item já foi adicionado ao carrinho!');
      return false; // duplicata
    }
    dispatch({ type: 'ADICIONAR_ITEM', payload: produto });
    setMensagemAviso(''); // limpa aviso se adicionou
    setSidebarAberto(true); // abre sidebar automaticamente
    return true;
  };


  const removerItem = (produtoId) => {
    dispatch({ type: 'REMOVER_ITEM', payload: produtoId });
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
      limparCarrinho,
      calcularTotal,
      totalItens,
      sidebarAberto,
      setSidebarAberto,
      mensagemAviso,
      setMensagemAviso


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