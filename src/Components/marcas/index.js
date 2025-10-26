import { useState } from 'react';
import styles from './marcas.module.css';

// Importe suas imagens aqui
import idtLogo from '../../assets/imagens/IDT.png';
import himediaLogo from '../../assets/imagens/HIMEDIA.png';
import biotechrabbitLogo from '../../assets/imagens/BIOTECH.png';
// Adicione mais imports conforme necessário

const Marcas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const marcas = [
    idtLogo,
    himediaLogo,
    biotechrabbitLogo,
    // Adicione mais imagens aqui
  ];

  const nextSlide = () => {
    if (currentIndex < marcas.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className={styles.marcasSection}>
      <div className={styles.marcasHeader}>
        <h2>PRINCIPAIS MARCAS</h2>
      </div>

      <div className={styles.carouselContainer}>
        <button 
          className={styles.btnPrev}
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          &lt;
        </button>

        <div className={styles.marcasWrapper}>
          {marcas.slice(currentIndex, currentIndex + 3).map((marca, index) => (
            <div key={index} className={styles.marcaItem}>
              <img src={marca} alt={`Marca ${index + 1}`} />
            </div>
          ))}
        </div>

        <button 
          className={styles.btnNext}
          onClick={nextSlide}
          disabled={currentIndex >= marcas.length - 3}
        >
          &gt;
        </button>
      </div>
      <div className={styles.divider}></div>
    </section>
  );
};

export default Marcas;