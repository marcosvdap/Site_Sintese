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
     
  } = useProdutos();
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    codigo_fabricante: '',
    preco: '',
    descricao: '',
    imagem: ''
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
      nome: formData.nome,
      categoria: formData.categoria,
      codigo_fabricante: formData.codigo_fabricante,
      preco: parseFloat(formData.preco),
      descricao: formData.descricao,
      imagem: formData.imagem
    };

    try {
      if (editando) {
        await atualizarProduto(editando, produtoData);
        setMensagem({ tipo: 'sucesso', texto: 'Produto atualizado com sucesso!' });
        setEditando(null);
      } else {
        await adicionarProduto(produtoData);
        setMensagem({ tipo: 'sucesso', texto: 'Produto adicionado com sucesso!' });
      }
      
      // Limpar formulário
      setFormData({
        nome: '', 
        categoria: '', 
        codigo_fabricante: '',
        preco: '',
        descricao: '', 
        imagem: ''
      });
      
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar produto!' });
    }
  };

  const handleEdit = (produto) => {
    setFormData({
      nome: produto.nome,
      categoria: produto.categoria,
      codigo_fabricante: produto.codigo_fabricante || '',
      preco: produto.preco.toString(),
      descricao: produto.descricao || '',
      imagem: produto.imagem || ''
    });
    setEditando(produto.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja deletar "${nome}"?`)) {
      try {
        await deletarProduto(id);
        setMensagem({ tipo: 'sucesso', texto: 'Produto deletado com sucesso!' });
      } catch (error) {
        setMensagem({ tipo: 'erro', texto: 'Erro ao deletar produto!' });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lista de categorias mais comuns baseadas nos produtos importados
  const categorias = [
    'Bioterch Rabbit',
    'Invitek',
    'HiMedia'
  ];

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
          {editando ? 'Editar' : 'Adicionar'} Produto
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
          <label className={styles.label}>Nome do Produto *</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Ex: 2019-NCOV RUO KIT 500 RXN"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Categoria/Fabricante *</label>
          <select
            className={styles.select}
            value={formData.categoria}
            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Código do Fabricante</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Ex: 10006713"
            value={formData.codigo_fabricante}
            onChange={(e) => setFormData({...formData, codigo_fabricante: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Preço (R$) *</label>
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
            rows="4"
            value={formData.descricao}
            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>URL da Imagem</label>
          <input
            className={styles.input}
            type="text"
            placeholder="/imagens/produtos/nome-produto.jpg ou https://..."
            value={formData.imagem}
            onChange={(e) => setFormData({...formData, imagem: e.target.value})}
          />
          {formData.imagem && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={formData.imagem} 
                alt="Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '150px',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          )}
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
                  nome: '', 
                  categoria: '', 
                  codigo_fabricante: '',
                  preco: '',
                  descricao: '', 
                  imagem: ''
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
            Produtos Cadastrados 
            <span className={styles.productCount}>({produtos.length})</span>
          </h2>
        </div>
        
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorText}>
              {error}
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
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableHeadCell}>ID</th>
                  <th className={styles.tableHeadCell}>Nome</th>
                  <th className={styles.tableHeadCell}>Categoria</th>
                  <th className={styles.tableHeadCell}>Cód. Fabricante</th>
                  <th className={styles.tableHeadCell}>Preço</th>
                  <th className={styles.tableHeadCell}>Imagem</th>
                  <th className={styles.tableHeadCell}>Criado em</th>
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
                      <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {produto.nome}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.categoryBadge}>
                        {produto.categoria}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {produto.codigo_fabricante || '-'}
                    </td>
                    <td className={`${styles.tableCell} ${styles.price}`}>
                      R$ {produto.preco ? produto.preco.toFixed(2) : '0.00'}
                    </td>
                    <td className={styles.tableCell}>
                      {produto.imagem ? (
                        <span style={{ color: '#48bb78', fontSize: '12px' }}>✓</span>
                      ) : (
                        <span style={{ color: '#ccc', fontSize: '12px' }}>-</span>
                      )}
                    </td>
                    <td className={styles.tableCell} style={{ fontSize: '12px' }}>
                      {formatDate(produto.created_at)}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEdit(produto)}
                          className={styles.btnEdit}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id, produto.nome)}
                          className={styles.btnDelete}
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;