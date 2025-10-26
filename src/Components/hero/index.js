import { Link } from "react-router-dom";
import styles from './hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Transformando Ciência em Soluções
        </h1>
        
        <p className={styles.heroText}>
          Distribuidor exclusivo <strong>IDT no Brasil</strong>.
          <br />
          Mais de <strong>3.000 produtos de biotecnologia</strong>
          <br />
          <strong>das melhores marcas mundiais</strong> para
          <br />
          impulsionar sua pesquisa.
        </p>

        <div className={styles.heroButtons}>
          <Link to="/catalogo" className={`${styles.btn} ${styles.btnPrimary}`}>
            SAIBA MAIS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;