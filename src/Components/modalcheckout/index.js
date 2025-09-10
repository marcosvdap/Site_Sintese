// src/Components/catalogo/ModalCheckout/index.js
import React, { useState } from 'react';
import styles from './modalcheckout.module.css';
import supabase from 'supabase-client'; // Importando o cliente Supabase

const ModalCheckout = ({ isOpen, onClose, carrinho, total }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validação dos campos
  const validateForm = () => {
    const newErrors = {};

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar telefone
    const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!phoneRegex.test(formData.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatar telefone enquanto digita
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
    }
    setFormData({ ...formData, telefone: value });
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados do pedido
      // Preparar array de itens no formato JSON
      const itensJsonb = carrinho.map(produto => ({
        produto_nome: produto.nome,
        preco: produto.preco
      }));

      // Chamar a RPC
      const { data, error } = await supabase.rpc("criar_venda", {
        p_nome: formData.nome,
        p_email: formData.email,
        p_telefone: formData.telefone,
        p_total: total,
        p_itens: itensJsonb
      });

      if (error) throw error;

      // Mostrar sucesso
      setShowSuccess(true);

      // Limpar carrinho e fechar modal após 3 segundos
      setTimeout(() => {
        onClose(true); // true indica que a compra foi finalizada
        setShowSuccess(false);
        setFormData({ nome: '', email: '', telefone: '' });
      }, 5000);

    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      setErrors({ submit: 'Erro ao processar pedido. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lidar com clique no overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  // Resetar formulário quando fechar
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ nome: '', email: '', telefone: '' });
      setErrors({});
      setShowSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            🛒 Finalizar Compra
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {!showSuccess ? (
            <>
              {/* Resumo do Pedido */}
              <div className={styles.summary}>
                <h3 className={styles.summaryTitle}>
                  📋 Resumo do Pedido
                </h3>

                {/* Lista de produtos */}
                <div className={styles.summaryProdutos}>
                  {carrinho.map((item, index) => (
                    <div key={index} className={styles.produtoItem}>
                      <span className={styles.produtoNome}>
                        {item.nome}
                      </span>
                      {item.quantidade && (
                        <span className={styles.produtoQtd}>
                          x{item.quantidade}
                        </span>
                      )}
                      <span className={styles.produtoPreco}>
                        R$ {(item.preco * (item.quantidade || 1)).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryTotal}>
                  Total: R$ {total.toFixed(2).replace('.', ',')}
                </div>
              </div>

              {/* Formulário */}
              <form className={styles.form} onSubmit={handleSubmit}>
                <h3 className={styles.formTitle}>
                  👤 Dados para Entrega
                </h3>

                {/* Campo Nome */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Nome Completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Digite seu nome completo"
                    disabled={isSubmitting}
                  />
                  {errors.nome && (
                    <span className={styles.errorMessage}>{errors.nome}</span>
                  )}
                </div>

                {/* Campo Email */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    E-mail <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span className={styles.errorMessage}>{errors.email}</span>
                  )}
                </div>

                {/* Campo Telefone */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Telefone/WhatsApp <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    className={`${styles.input} ${errors.telefone ? styles.inputError : ''}`}
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    maxLength="15"
                    disabled={isSubmitting}
                  />
                  {errors.telefone && (
                    <span className={styles.errorMessage}>{errors.telefone}</span>
                  )}
                </div>

                {/* Erro geral */}
                {errors.submit && (
                  <div className={styles.submitError}>
                    {errors.submit}
                  </div>
                )}

                {/* Botão Submit */}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>⏳ Processando...</>
                  ) : (
                    <>✅ Confirmar Pedido</>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Mensagem de Sucesso */
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className={styles.successTitle}>
                Pedido Realizado com Sucesso!
              </h2>

              <p className={styles.successMessage}>
                Obrigado pela sua compra, <strong>{formData.nome}</strong>!
              </p>

              <p className={styles.successMessage}>
                Você receberá um e-mail de confirmação em breve.
              </p>

              <div className={styles.successEmail}>
                📧 Enviado para: {formData.email}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCheckout;