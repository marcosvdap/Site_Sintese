import React from "react";
import styles from "./botao.module.css";

const Botao = ({ children, tipo = "primario" }) => {
  return <div className={`${styles.botao} ${styles[tipo]}`}>{children}</div>;
};

export default Botao;