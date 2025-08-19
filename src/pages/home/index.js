import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import Hero from "Components/hero";
function Home() {
    return (
        <>
            <Cabecalho />
             <Hero />
            <body>
                <section class="stats">
                    <div class="stats-container">
                        <div class="stat-card">
                            <div class="stat-number">3.078</div>
                            <div class="stat-label">Produtos em Estoque</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">20+</div>
                            <div class="stat-label">Marcas Mundiais</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">15</div>
                            <div class="stat-label">Anos de Experiência</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">500+</div>
                            <div class="stat-label">Clientes Atendidos</div>
                        </div>
                    </div>
                </section>


                <section class="products-preview">
                    <h2 class="section-title">Nossas Linhas de Produtos</h2>
                    <p class="section-subtitle">Soluções completas para todas as áreas da biotecnologia</p>

                    <div class="products-categories">
                        <div class="category-card">
                            <div class="category-header">
                                <div class="category-icon">🧬</div>
                                <h3 class="category-title">Biologia Molecular</h3>
                            </div>
                            <div class="category-content">
                                <ul class="category-list">
                                    <li>Oligonucleotídeos customizados</li>
                                    <li>Primers e Sondas qPCR</li>
                                    <li>Master Mix para PCR</li>
                                    <li>Enzimas de restrição</li>
                                    <li>Kits de extração DNA/RNA</li>
                                </ul>
                            </div>
                        </div>

                        <div class="category-card">
                            <div class="category-header">
                                <div class="category-icon">🔬</div>
                                <h3 class="category-title">Diagnóstico</h3>
                            </div>
                            <div class="category-content">
                                <ul class="category-list">
                                    <li>FISH Probes customizadas</li>
                                    <li>Kits de diagnóstico molecular</li>
                                    <li>Reagentes para citogenética</li>
                                    <li>Anticorpos monoclonais</li>
                                    <li>Sistemas automatizados</li>
                                </ul>
                            </div>
                        </div>

                        <div class="category-card">
                            <div class="category-header">
                                <div class="category-icon">🧪</div>
                                <h3 class="category-title">Pesquisa</h3>
                            </div>
                            <div class="category-content">
                                <ul class="category-list">
                                    <li>CRISPR/Cas9 sistemas</li>
                                    <li>NGS Library Prep</li>
                                    <li>Sequenciamento Sanger</li>
                                    <li>Western Blot reagentes</li>
                                    <li>Cultura celular</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="partners">
                    <h2 class="section-title">Marcas de Confiança Mundial</h2>
                    <p class="section-subtitle">Representamos as melhores empresas de biotecnologia do mundo</p>

                    <div class="partners-grid">
                        <div class="partner-card">
                            <div class="partner-logo">IDT</div>
                            <p class="partner-info">279 produtos</p>
                            <span class="exclusive-badge">Distribuidor Exclusivo</span>
                        </div>

                        <div class="partner-card">
                            <div class="partner-logo">BIORAD</div>
                            <p class="partner-info">1.708 produtos</p>
                        </div>

                        <div class="partner-card">
                            <div class="partner-logo">ZYMO RESEARCH</div>
                            <p class="partner-info">309 produtos</p>
                        </div>

                        <div class="partner-card">
                            <div class="partner-logo">BIOCARE MEDICAL</div>
                            <p class="partner-info">30 produtos especializados</p>
                        </div>

                        <div class="partner-card">
                            <div class="partner-logo">BIOTECHRABBIT</div>
                            <p class="partner-info">114 produtos</p>
                        </div>

                        <div class="partner-card">
                            <div class="partner-logo">BENCHMARK</div>
                            <p class="partner-info">96 produtos</p>
                        </div>
                    </div>
                </section>

                <section class="features">
                    <h2 class="section-title">Por que escolher a Síntese Bio?</h2>

                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🚚</div>
                            <h3 class="feature-title">Entrega Rápida</h3>
                            <p class="feature-description">
                                Logística especializada para produtos sensíveis.
                                Entrega em todo território nacional com rastreamento completo.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">👨‍🔬</div>
                            <h3 class="feature-title">Suporte Técnico</h3>
                            <p class="feature-description">
                                Equipe de especialistas pronta para auxiliar na escolha
                                dos produtos ideais para sua pesquisa.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">✅</div>
                            <h3 class="feature-title">Qualidade Garantida</h3>
                            <p class="feature-description">
                                Todos os produtos passam por rigoroso controle de qualidade.
                                Certificações internacionais e rastreabilidade completa.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">💰</div>
                            <h3 class="feature-title">Melhores Preços</h3>
                            <p class="feature-description">
                                Condições especiais para universidades e centros de pesquisa.
                                Parcelamento e condições flexíveis de pagamento.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">📋</div>
                            <h3 class="feature-title">Cotação Online</h3>
                            <p class="feature-description">
                                Sistema moderno de cotação online. Resposta em até 24 horas
                                com orçamento detalhado e personalizado.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🏢</div>
                            <h3 class="feature-title">Presença Nacional</h3>
                            <p class="feature-description">
                                Matriz em Belo Horizonte e filial em São Paulo.
                                Atendimento em todo o Brasil desde 2011.
                            </p>
                        </div>
                    </div>
                </section>


                <section class="cta">
                    <h2>Pronto para revolucionar sua pesquisa?</h2>
                    <p>Entre em contato conosco e descubra como podemos ajudar seu laboratório</p>
                    <div class="hero-buttons">
                        <a href="catalogo.html" class="btn btn-primary">Ver Catálogo Completo</a>
                        <a href="contato.html" class="btn btn-secondary">Solicitar Cotação</a>
                    </div>
                </section>
            </body>
            <Rodape />
        </>
    )
} export default Home;
