import styles from './estatistica.module.css';

// Importe suas imagens aqui
import iconMarcas from '../../assets/imagens/marcas.png';
import iconMercado from '../../assets/imagens/mercado.png';
import iconClientes from '../../assets/imagens/clientes.png';

const Estatisticas = () => {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <img src={iconMarcas} alt="Marcas Mundiais" className={styles.statIcon} />
          <h3 className={styles.statNumber}>20+</h3>
          <p className={styles.statLabel}>marcas mundiais</p>
        </div>

        <div className={styles.statCard}>
          <img src={iconMercado} alt="Anos de Mercado" className={styles.statIcon} />
          <h3 className={styles.statNumber}>15</h3>
          <p className={styles.statLabel}>anos de mercado</p>
        </div>

        <div className={styles.statCard}>
          <img src={iconClientes} alt="Clientes Atendidos" className={styles.statIcon} />
          <h3 className={styles.statNumber}>500+</h3>
          <p className={styles.statLabel}>clientes atendidos</p>
        </div>
      </div>
    </section>
  );
};

export default Estatisticas;