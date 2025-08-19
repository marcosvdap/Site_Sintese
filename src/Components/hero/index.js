import { Link } from "react-router-dom";
import styles from './hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Transformando Ciência em Soluções</h1>
        <p className={styles.heroSubtitle}>
          Distribuidor exclusivo IDT no Brasil. Mais de 3.000 produtos de
          biotecnologia das melhores marcas mundiais para impulsionar sua
          pesquisa.
        </p>
        <div className={styles.heroButtons}>
          <Link to="/catalogo" className={`${styles.btn} ${styles.btnPrimary}`}>
            Explorar Catálogo
          </Link>
          <Link to="/sobre" className={`${styles.btn} ${styles.btnSecondary}`}>
            Saiba Mais
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;