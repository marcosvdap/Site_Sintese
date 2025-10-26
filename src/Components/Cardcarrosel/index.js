import React, { useState, useEffect } from 'react';
import styles from './cardcarrosel.module.css';
import { Link } from "react-router-dom";

const CardCarrosel = () => {
  const [cards, setCards] = useState([]);

  // Fetch dos produtos do backend
  useEffect(() => {
    fetch('http://localhost:5000/api/produtos/destaque')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar produtos');
        return res.json();
      })
      .then(data => {
        setCards(data);
      })
      .catch(err => {
        console.error('Erro ao carregar produtos:', err);
      });
  }, []);

  return (
    <div>
      <div className={styles.carrouselHeader}>
        <h2>DESTAQUES</h2>
      </div>

      <div className={styles.carroselContainer}>
        <div className={styles.carroselGrid}>
          {cards.map(card => (
            <div className={styles.carroselCard} key={card.id}>
              <div className={styles.imageContainer}>
                <img
                  src={'/caixa.png'}
                  alt={card.nome}
                />
              </div>
              <div className={styles.carroselCardContent}>
                <h3>{card.nome}</h3>
                <Link to="/Catalogo" className={styles.cardBtn}>
                  IR AO CATÁLOGO
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.divider}></div>
      </div>
    </div>
  );
};

export default CardCarrosel;