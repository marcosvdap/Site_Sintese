import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import Hero from "Components/hero";
import Marcas from "Components/marcas"
import Sobre from "Components/sobre";
import Cardcarrosel from "Components/Cardcarrosel";
import Cookies from "Components/cookies";   
import Estatisticas from "Components/estatistica";  
function Home() {
    return (
        <>
            <Cookies />
            <Cabecalho />
            <Hero />
            <Marcas />
            <Estatisticas />
            <Cardcarrosel />
            <section >
                <Sobre />
            </section>
            <section className="partners">
                <h2 className="section-title">Marcas de Confiança Mundial</h2>
                <p className="section-subtitle">Representamos as melhores empresas de biotecnologia do mundo</p>

                <div className="partners-grid">
                    <div className="partner-card">
                        <div className="partner-logo">IDT</div>
                        <p className="partner-info">279 produtos</p>
                        <span className="exclusive-badge">Distribuidor Exclusivo</span>
                    </div>

                    <div className="partner-card">
                        <div className="partner-logo">ZYMO RESEARCH</div>
                        <p className="partner-info">309 produtos</p>
                    </div>

                    <div className="partner-card">
                        <div className="partner-logo">HIMEDIA</div>
                        <p className="partner-info">30 produtos especializados</p>
                    </div>

                    <div className="partner-card">
                        <div className="partner-logo">BIOTECH RABBIT</div>
                        <p className="partner-info">114 produtos</p>
                    </div>

                    <div className="partner-card">
                        <div className="partner-logo">BIORAD</div>
                        <p className="partner-info">1.708 produtos</p>
                    </div>
                </div>
            </section>
            <section  className="cta">
                <h2>Pronto para revolucionar sua pesquisa?</h2>
                <p>Entre em contato conosco e descubra como podemos ajudar seu laboratório</p>
                <div className="hero-buttons">
                    <a
                        href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20mais%20informações."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                    >
                        💬 Fale no WhatsApp
                    </a>
                </div>
            </section>


            <Rodape />
        </>
    );
}

export default Home;

