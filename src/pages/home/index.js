import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import Hero from "Components/hero";
import Sobre from "Components/sobre";
import Cardcarrosel from "Components/Cardcarrosel";
import Cookies from "Components/cookies";   

function Home() {
    return (
        <>
            <Cookies />
            <Cabecalho />
            <Hero />
           
            <section className="stats">
                <div className="stats-container">
                    {/* <div className="stat-card">
                        <div className="stat-number">3.078</div>
                        <div className="stat-label">Produtos em Estoque</div>
                    </div> */}
                    <div className="stat-card">
                        <div className="stat-number">20+</div>
                        <div className="stat-label">Marcas Mundiais</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">15</div>
                        <div className="stat-label">Anos de Experiência</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Clientes Atendidos</div>
                    </div>
                </div>
            </section>

            <section className="products-preview">
                <h2 className="section-title">Nossas Linhas de Produtos</h2>
                <p className="section-subtitle">Soluções completas para todas as áreas da biotecnologia</p>
                <Cardcarrosel />
            </section>

            <section id="sobre">
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

            {/* <section className="features">
                <h2 className="section-title">Por que escolher a Síntese Bio?</h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚚</div>
                        <h3 className="feature-title">Entrega Rápida</h3>
                        <p className="feature-description">
                            Logística especializada para produtos sensíveis.
                            Entrega em todo território nacional com rastreamento completo.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">👨‍🔬</div>
                        <h3 className="feature-title">Suporte Técnico</h3>
                        <p className="feature-description">
                            Equipe de especialistas pronta para auxiliar na escolha
                            dos produtos ideais para sua pesquisa.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">✅</div>
                        <h3 className="feature-title">Qualidade Garantida</h3>
                        <p className="feature-description">
                            Todos os produtos passam por rigoroso controle de qualidade.
                            Certificações internacionais e rastreabilidade completa.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3 className="feature-title">Melhores Preços</h3>
                        <p className="feature-description">
                            Condições especiais para universidades e centros de pesquisa.
                            Parcelamento e condições flexíveis de pagamento.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📋</div>
                        <h3 className="feature-title">Cotação Online</h3>
                        <p className="feature-description">
                            Sistema moderno de cotação online. Resposta em até 24 horas
                            com orçamento detalhado e personalizado.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🏢</div>
                        <h3 className="feature-title">Presença Nacional</h3>
                        <p className="feature-description">
                            Matriz em Belo Horizonte e filial em São Paulo.
                            Atendimento em todo o Brasil desde 2011.
                        </p>
                    </div>
                </div>
            </section> */}

            <section id="faleconosco" className="cta">
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

