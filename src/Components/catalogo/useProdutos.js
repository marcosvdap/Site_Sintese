import { useState, useEffect } from 'react';
import axios from 'axios';

// Usando proxy do package.json, não precisa da URL completa
const API_URL = '/api';

export const useProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/produtos`);
      setProdutos(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Erro ao carregar produtos do banco de dados SQLite');
    } finally {
      setLoading(false);
    }
  };

  const filtrarProdutos = (produtos, filtroCategoria, busca) => {
    let produtosFiltrados = [...produtos];
    
    if (filtroCategoria && filtroCategoria !== 'todos') {
      produtosFiltrados = produtosFiltrados.filter(
        produto => produto.categoria === filtroCategoria
      );
    }
    
    if (busca) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
        produto.descricao?.toLowerCase().includes(busca.toLowerCase())
      );
    }
    
    return produtosFiltrados;
  };

  const obterCategorias = (produtos) => {
    const categoriasUnicas = [...new Set(produtos.map(p => p.categoria))];
    return ['todos', ...categoriasUnicas];
  };

  const adicionarProduto = async (novoProduto) => {
    try {
      const response = await axios.post(`${API_URL}/produtos`, novoProduto);
      await fetchProdutos(); // Recarregar lista
      return response.data;
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      setError('Erro ao adicionar produto');
      throw err;
    }
  };

  const atualizarProduto = async (id, dadosAtualizados) => {
    try {
      const response = await axios.put(`${API_URL}/produtos/${id}`, dadosAtualizados);
      await fetchProdutos(); // Recarregar lista
      return response.data;
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      setError('Erro ao atualizar produto');
      throw err;
    }
  };

  const deletarProduto = async (id) => {
    try {
      await axios.delete(`${API_URL}/produtos/${id}`);
      await fetchProdutos(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      setError('Erro ao deletar produto');
      throw err;
    }
  };


  return {
    produtos,
    loading,
    error,
    filtrarProdutos,
    obterCategorias,
    adicionarProduto,
    atualizarProduto,
    deletarProduto,
    refetch: fetchProdutos
  };
};

export default useProdutos;