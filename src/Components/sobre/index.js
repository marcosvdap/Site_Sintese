import styles from "./sobre.module.css";

function Sobre() {
  return (
      <section className={styles.sobre}>
      <h2 className={styles.sectionTitle}>Sobre a Síntese Bio</h2>
      <p className={styles.sectionSubtitle}>
        Somos uma empresa brasileira especializada em fornecer soluções inovadoras 
        para pesquisa científica, diagnóstico e biotecnologia.
      </p>
      <div className={styles.sobreContainer}>
        <p>
          Desde 2011, atuamos representando as principais marcas internacionais, 
          garantindo produtos de alta qualidade e suporte técnico especializado. 
          Nossa missão é acelerar descobertas científicas no Brasil, oferecendo não 
          apenas reagentes e kits, mas também confiança, parceria e compromisso com a ciência.
        </p>
        <p>
          Com presença nacional e centros em Belo Horizonte e São Paulo, 
          atendemos laboratórios, universidades e centros de pesquisa em todo o território. 
          Acreditamos que a biotecnologia é o futuro, e estamos prontos para caminhar ao seu lado.
        </p>
      </div>
    </section>
  );
}

export default Sobre;



