import { Link } from "react-router-dom";
import React, { useState } from "react";
import logo from './SINTESE_MARCA-1.png';
import styles from './cabecalho.module.css';
import Cabecalholink from "Components/Cabecalholink";
import Botao from "Components/botao";
import { FaBars, FaTimes } from "react-icons/fa";

function Cabecalho() {
    const [menuAberto, setMenuAberto] = useState(false);

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };
    return (
        <header className={styles.cabecalho}>
            <Link to="./">
                <img src={logo} alt="sintese"></img>
            </Link>
            <button className={styles.menuToggle} onClick={toggleMenu}>
                {menuAberto ? <FaTimes /> : <FaBars />}
            </button>

            <nav className={`${styles.nav} ${menuAberto ? styles.aberto : ""}`}>
                <Botao tipo="primario">
                    <Cabecalholink URL="./">Home</Cabecalholink>
                </Botao>

                <Botao tipo="primario">
                    <Cabecalholink URL="./catalogo">Catalogo</Cabecalholink>
                </Botao>

                <Botao tipo="primario">
                    <Cabecalholink URL="./sobre">Sobre</Cabecalholink>
                </Botao>

                <Botao tipo="primario">
                    <Cabecalholink URL="./faleconosco">Fale conosco</Cabecalholink>
                </Botao>
            </nav>
        </header>

    )
}

export default Cabecalho;

