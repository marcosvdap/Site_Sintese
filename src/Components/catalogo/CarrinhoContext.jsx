// src/components/Catalogo/CarrinhoContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CarrinhoContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState(() => {
    // Recupera o carrinho do localStorage ao inicializar
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  const [mensagemAviso, setMensagemAviso] = useState('');
  

  // Salva o carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  // Limpar mensagem de aviso após 3 segundos
  useEffect(() => {
    if (mensagemAviso) {
      const timer = setTimeout(() => {
        setMensagemAviso('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemAviso]);

  const adicionarItem = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
      // Se o item já existe, aumenta a quantidade
      atualizarQuantidade(produto.id, itemExistente.quantidade + 1);
      setMensagemAviso(`${produto.nome} - quantidade atualizada!`);
      
      return true;
    }

    // Se não existe, adiciona com quantidade 1
    setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    setMensagemAviso(`${produto.nome} adicionado ao carrinho!`);
    
    return true;
  };

  const removerItem = (id) => {
    const item = carrinho.find(item => item.id === id);
    setCarrinho(carrinho.filter(item => item.id !== id));
    if (item) {
      
      setMensagemAviso(`${item.nome} removido do carrinho`);
    }
  };

  const atualizarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade < 1) return;
    
    setCarrinho(carrinho.map(item =>
      item.id === id
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));
  };

 const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);

  const limparCarrinho = () => {
    setCarrinho([]);
    setMensagemAviso('Carrinho limpo!');
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      const preco = parseFloat(item.preco) || 0;
      const quantidade = parseInt(item.quantidade) || 1;
      return total + (preco * quantidade);
    }, 0);
  };

  const obterQuantidadeTotal = () => {
    return carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
  };

  return (
    <CarrinhoContext.Provider value={{
      carrinho,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      calcularTotal,
      obterQuantidadeTotal,
      mensagemAviso,
      totalItens
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export default CarrinhoContext;