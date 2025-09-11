// TEMPORÁRIO: Configuração direta para teste
// Substitua pelos seus dados reais
process.env.EMAIL_USER = 'marcosv.paes10@gmail.com';  // COLOQUE SEU EMAIL AQUI
process.env.EMAIL_PASS = 'spynygrueuklbhbu';      // COLOQUE SUA SENHA DE APP AQUI

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
const produtosRoutes = require('./produtos');
app.use('/api/produtos', produtosRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando com SQLite!' });
});

// 🚀 Rota para enviar e-mail
app.post("/api/enviar-email", async (req, res) => {
  console.log("\n📨 Nova requisição de e-mail recebida");
  console.log("📍 Timestamp:", new Date().toISOString());
  console.log("📦 Body recebido:", JSON.stringify(req.body, null, 2));
  
  const { nome, email, telefone, dataEntrega, parcelas, itens, total } = req.body;

  // Validações detalhadas
  const camposFaltando = [];
  if (!nome) camposFaltando.push("nome");
  if (!email) camposFaltando.push("email");
  if (!telefone) camposFaltando.push("telefone");
  if (!itens || itens.length === 0) camposFaltando.push("itens");
  if (total === undefined || total === null) camposFaltando.push("total");
  
  if (camposFaltando.length > 0) {
    console.error("❌ Campos faltando:", camposFaltando);
    return res.status(400).json({ 
      success: false, 
      message: `Campos obrigatórios faltando: ${camposFaltando.join(", ")}` 
    });
  }

  // Verificar configuração de e-mail
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Variáveis de ambiente não configuradas");
    console.error("EMAIL_USER existe?", !!process.env.EMAIL_USER);
    console.error("EMAIL_PASS existe?", !!process.env.EMAIL_PASS);
    
    return res.status(500).json({ 
      success: false, 
      message: "Servidor não está configurado para enviar e-mails. Configure as variáveis de ambiente." 
    });
  }

  try {
    console.log("📧 Configurando transporter para:", process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verificar conexão
    console.log("🔌 Verificando conexão com Gmail...");
    await transporter.verify();
    console.log("✅ Conexão com Gmail OK!");

    // Formatar total corretamente (aceitar tanto número quanto string)
    const totalFormatado = typeof total === 'number' 
      ? total.toFixed(2).replace(".", ",")
      : total;

    // 🔹 1) E-mail para a LOJA
    const mailToStore = {
      from: `"Loja Online" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Temporariamente enviar para si mesmo para teste
      // to: "destinatario@dominio.com", // 👈 Descomentar e colocar e-mail real da loja depois
      subject: "🛒 Novo Pedido Recebido",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🛒 Novo Pedido Recebido</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h3>Dados do Cliente:</h3>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>dataentrega:</strong> ${dataEntrega}</p>
            <p><strong>parcelas:</strong> ${parcelas}</p>
          </div>
          <h3 style="margin-top: 20px;">📦 Itens do Pedido:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #e0e0e0;">
                <th style="padding: 10px; text-align: left;">Produto</th>
                <th style="padding: 10px; text-align: left;">Fabricante</th>
                <th style="padding: 10px; text-align: center;">Codigo Fabricante</th>
                <th style="padding: 10px; text-align: center;">Qtd</th>
                <th style="padding: 10px; text-align: right;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${itens.map(item => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px;">${item.nome}</td>
                  <td style="padding: 10px;">${item.categoria}</td>
                  <td style="padding: 10px;text-align: center;">${item.codigofabricante}</td>
                  <td style="padding: 10px; text-align: center;">${item.quantidade}</td>
                  <td style="padding: 10px; text-align: right;">
                    R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <h3 style="text-align: right; color: #2ecc71; margin-top: 20px;">
            Total: R$ ${totalFormatado}
          </h3>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Pedido recebido em ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `,
    };

    // 🔹 2) E-mail para o CLIENTE
    const mailToCustomer = {
      from: `"Loja Online" <${nome}>`,
      to: email,
      subject: "✅ Pedido Confirmado - Loja Online",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; text-align: center; margin: 0;">
              ✅ Pedido Confirmado!
            </h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Olá, ${nome}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Recebemos seu pedido com sucesso e já estamos preparando tudo com muito carinho! 🎉
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                📋 Resumo do Pedido:
              </h3>
              <table style="width: 100%; margin-top: 15px;">
                ${itens.map(item => `
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong>${item.nome}</strong>
                    </td>
                    <td style="text-align: center; padding: 8px;">
                      x${item.quantidade}
                    </td>
                    <td style="text-align: right; padding: 8px 0;">
                      R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                `).join("")}
                <tr style="border-top: 2px solid #e0e0e0;">
                  <td colspan="2" style="padding: 15px 0; font-size: 18px;">
                    <strong>Total:</strong>
                  </td>
                  <td style="text-align: right; padding: 15px 0; font-size: 18px; color: #2ecc71;">
                    <strong>R$ ${totalFormatado}</strong>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #2e7d32;">
                <strong>📞 Próximos passos:</strong><br>
                Em breve entraremos em contato pelo telefone ${telefone} para confirmar a entrega.
              </p>
            </div>
            
            <p style="text-align: center; margin-top: 30px; color: #666;">
              Obrigado por comprar conosco! 💙
            </p>
          </div>
        </div>
      `,
    };

    // Enviar e-mails
    console.log("📤 Enviando e-mail para a loja...");
    const infoStore = await transporter.sendMail(mailToStore);
    console.log("✅ E-mail para loja enviado:", infoStore.messageId);
    
    console.log("📤 Enviando e-mail para o cliente:", email);
    const infoCustomer = await transporter.sendMail(mailToCustomer);
    console.log("✅ E-mail para cliente enviado:", infoCustomer.messageId);

    // Resposta de sucesso
    console.log("🎉 Todos os e-mails enviados com sucesso!");
    
    res.status(200).json({ 
      success: true, 
      message: "Pedido enviado com sucesso!",
      details: {
        loja: infoStore.messageId,
        cliente: infoCustomer.messageId
      }
    });
    
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    console.error("Tipo do erro:", error.name);
    console.error("Mensagem do erro:", error.message);
    console.error("Stack:", error.stack);
    
    let mensagemErro = "Erro ao enviar e-mail. ";
    
    if (error.message.includes("Invalid login")) {
      mensagemErro += "Credenciais inválidas. Use uma Senha de App do Gmail.";
      console.log("\n📌 IMPORTANTE: Para Gmail você precisa:");
      console.log("1. Ativar verificação em 2 etapas");
      console.log("2. Gerar uma Senha de App em: https://myaccount.google.com/apppasswords");
      console.log("3. Usar essa senha de 16 caracteres no arquivo .env");
    } else if (error.message.includes("self signed certificate")) {
      mensagemErro += "Erro de certificado SSL.";
    } else if (error.message.includes("ECONNREFUSED")) {
      mensagemErro += "Não foi possível conectar ao servidor de e-mail.";
    } else if (error.message.includes("ETIMEDOUT")) {
      mensagemErro += "Timeout na conexão com o servidor de e-mail.";
    } else {
      mensagemErro += error.message;
    }
    
    res.status(500).json({ 
      success: false, 
      message: mensagemErro,
      error: error.message 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`🗄️  Banco de dados SQLite ativo`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER ? '✅' : '❌ FALTANDO!'}`);
  console.log(`🔑 Senha configurada: ${process.env.EMAIL_PASS ? '✅' : '❌ FALTANDO!'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n⚠️  ATENÇÃO: Configure o arquivo .env com:`);
    console.log(`   EMAIL_USER=seu-email@gmail.com`);
    console.log(`   EMAIL_PASS=sua-senha-de-app-do-google`);
  }
  console.log(`${'='.repeat(50)}\n`);
});