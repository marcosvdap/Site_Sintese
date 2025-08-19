// src/pages/Admin/index.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProdutos } from '../../Components/catalogo/useProdutos';
import styles from './admin.module.css';

const Admin = () => {
  const { 
    produtos, 
    loading, 
    error,
    adicionarProduto, 
    atualizarProduto, 
    deletarProduto,
    refetch 
  } = useProdutos();
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    preco: '',
    descricao: '',
    imagem: '',
    estoque: '',
    marca: ''
  });
  
  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Limpar mensagem após 3 segundos
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => {
        setMensagem({ tipo: '', texto: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const produtoData = {
      ...formData,
      preco: parseFloat(formData.preco),
      estoque: parseInt(formData.estoque) || 0
    };

    try {
      if (editando) {
        await atualizarProduto(editando, produtoData);
        setMensagem({ tipo: 'sucesso', texto: '✅ Produto atualizado com sucesso!' });
        setEditando(null);
      } else {
        await adicionarProduto(produtoData);
        setMensagem({ tipo: 'sucesso', texto: '✅ Produto adicionado com sucesso!' });
      }
      
      // Limpar formulário
      setFormData({
        nome: '', categoria: '', preco: '',
        descricao: '', imagem: '', estoque: '', marca: ''
      });
      
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: '❌ Erro ao salvar produto!' });
    }
  };

  const handleEdit = (produto) => {
    setFormData({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco.toString(),
      descricao: produto.descricao || '',
      imagem: produto.imagem || '',
      estoque: produto.estoque.toString(),
      marca: produto.marca || ''
    });
    setEditando(produto.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja deletar "${nome}"?`)) {
      try {
        await deletarProduto(id);
        setMensagem({ tipo: 'sucesso', texto: '✅ Produto deletado com sucesso!' });
      } catch (error) {
        setMensagem({ tipo: 'erro', texto: '❌ Erro ao deletar produto!' });
      }
    }
  };

  const getStockClass = (estoque) => {
    if (estoque > 10) return styles.stockHigh;
    if (estoque > 0) return styles.stockMedium;
    return styles.stockLow;
  };

  if (loading) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>
            Carregando produtos do SQLite...
          </div>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>
          Administração de Produtos
        </h1>
        <Link to="/catalogo" className={styles.catalogLink}>
          Ver Catálogo
        </Link>
      </div>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>
          {editando ? '✏️ Editar' : '➕ Adicionar'} Produto
        </h2>
        
        {mensagem.texto && (
          <div className={
            mensagem.tipo === 'sucesso' 
              ? styles.mensagemSucesso 
              : styles.mensagemErro
          }>
            {mensagem.texto}
          </div>
        )}
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nome do Produto</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Ex: Kit de Extração de DNA"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Categoria</label>
          <select
            className={styles.select}
            value={formData.categoria}
            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="Extração">Extração</option>
            <option value="PCR">PCR</option>
            <option value="Primers">Primers</option>
            <option value="Clonagem">Clonagem</option>
            <option value="Enzimas">Enzimas</option>
            <option value="Sequenciamento">Sequenciamento</option>
          </select>
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Preço (R$)</label>
          <input
            className={styles.input}
            type="number"
            step="0.01"
            placeholder="450.00"
            value={formData.preco}
            onChange={(e) => setFormData({...formData, preco: e.target.value})}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Descrição</label>
          <textarea
            className={styles.textarea}
            placeholder="Descrição detalhada do produto..."
            value={formData.descricao}
            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>URL da Imagem</label>
          <input
            className={styles.input}
            type="text"
            placeholder="https://exemplo.com/imagem.jpg"
            value={formData.imagem}
            onChange={(e) => setFormData({...formData, imagem: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Quantidade em Estoque</label>
          <input
            className={styles.input}
            type="number"
            placeholder="25"
            value={formData.estoque}
            onChange={(e) => setFormData({...formData, estoque: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Marca</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Ex: IDT, Thermo, etc."
            value={formData.marca}
            onChange={(e) => setFormData({...formData, marca: e.target.value})}
          />
        </div>
        
        <div className={styles.buttonGroup}>
          <button className={styles.buttonPrimary} type="submit">
            {editando ? 'Atualizar' : 'Adicionar'} Produto
          </button>
          
          {editando && (
            <button 
              className={styles.buttonSecondary}
              type="button"
              onClick={() => {
                setEditando(null);
                setFormData({
                  nome: '', categoria: '', preco: '',
                  descricao: '', imagem: '', estoque: '', marca: ''
                });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            📦 Produtos Cadastrados 
            <span className={styles.productCount}>({produtos.length})</span>
          </h2>
        </div>
        
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorText}>
              ⚠️ {error}
            </div>
          </div>
        )}
        
        {produtos.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <div className={styles.emptyText}>
              Nenhum produto cadastrado ainda
            </div>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHeadCell}>ID</th>
                <th className={styles.tableHeadCell}>Nome</th>
                <th className={styles.tableHeadCell}>Categoria</th>
                <th className={styles.tableHeadCell}>Preço</th>
                <th className={styles.tableHeadCell}>Estoque</th>
                <th className={styles.tableHeadCell}>Marca</th>
                <th className={styles.tableHeadCell}>Ações</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td className={`${styles.tableCell} ${styles.productId}`}>
                    {produto.id}
                  </td>
                  <td className={`${styles.tableCell} ${styles.productName}`}>
                    {produto.nome}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.categoryBadge}>
                      {produto.categoria}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.price}`}>
                    R$ {produto.preco.toFixed(2)}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.stock} ${getStockClass(produto.estoque)}`}>
                      {produto.estoque}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.brand}`}>
                    {produto.marca || '-'}
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleEdit(produto)}
                        className={styles.btnEdit}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id, produto.nome)}
                        className={styles.btnDelete}
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;