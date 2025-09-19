import React, { useRef, useState, useEffect } from 'react';
import styles from './cardcarrosel.module.css';
import { Link } from "react-router-dom"; // 👈 importa o Link


const CardCarrosel = () => {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [cards, setCards] = useState([]);

  // Função para setar início do drag (mouse)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  // Função para mover o scroll conforme o mouse é arrastado
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // multiplicador para velocidade de scroll
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Função para terminar o drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mesma lógica para touch (mobile)
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    const swipeThreshold = 100;

    if (deltaX > swipeThreshold) {
      scrollRight();
    } else if (deltaX < -swipeThreshold) {
      scrollLeftFunc();
    }

    setTouchStartX(null);
  };

  // Funções para scroll com as setas
  const scrollLeftFunc = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -820, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 820, behavior: 'smooth' });
    }
  };

  // Fetch dos produtos do backend
  useEffect(() => {
    fetch('http://localhost:5000/api/produtos/destaque')  // Ajuste a URL conforme seu backend
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
    <div className={styles.carroselContainer}>
      <h2 className={styles.carroselTitle}>Destaques</h2>

      <div className={styles.carroselControls}>
        <button className={styles.carroselBtn} onClick={scrollLeftFunc}>‹</button>

        <div
          className={styles.carroselScroll}
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {cards.map(card => (
            <div className={styles.carroselCard} key={card.id}>
              <img
                src={card.imagem || '/Imagens/produtos/placeholder.png'}
                alt={card.nome}
              />
              <div className={styles.carroselCardContent}>
                <h3>{card.nome}</h3>
                <p>{card.categoria}</p>
                <p><strong>R$ {Number(card.preco).toFixed(2).replace('.', ',')}</strong></p>
                {/* Botão real que leva para /catalogo */}
                <Link to="/Catalogo" className={styles.cardBtn}>
                  →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.carroselBtn} onClick={scrollRight}>›</button>
      </div>
    </div>
  );
};

export default CardCarrosel;
