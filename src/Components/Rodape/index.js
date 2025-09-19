import styles from './rodape.module.css';

function Rodape() {
  return (
    <footer className={styles.rodape}>
      <h2>Desenvolvido por <span>Time Labs</span></h2>
      <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
    </footer>
  );
}

export default Rodape;
