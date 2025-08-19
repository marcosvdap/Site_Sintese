// src/components/Catalogo/FiltrosBusca.jsx
import React from 'react';

const FiltrosBusca = ({ 
  busca, 
  setBusca, 
  filtroCategoria, 
  setFiltroCategoria, 
  categorias 
}) => {
  
  console.log('FiltrosBusca - categorias recebidas:', categorias); // Debug
  
  return (
    <div style={{ padding: '20px', background: 'white', marginBottom: '20px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={busca}
          onChange={(e) => {
            console.log('Busca alterada para:', e.target.value); // Debug
            setBusca(e.target.value);
          }}
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {categorias && categorias.length > 0 ? categorias.map(categoria => (
          <button
            key={categoria}
            onClick={() => {
              console.log('Categoria alterada para:', categoria); // Debug
              setFiltroCategoria(categoria);
            }}
            style={{
              padding: '8px 16px',
              border: '1px solid #667eea',
              background: filtroCategoria === categoria ? '#667eea' : 'white',
              color: filtroCategoria === categoria ? 'white' : '#667eea',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            {categoria === 'todos' ? 'Todos' : categoria}
          </button>
        )) : (
          <div>Carregando categorias...</div>
        )}
      </div>
    </div>
  );
};

export default FiltrosBusca;