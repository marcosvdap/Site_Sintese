const nodemailer = require("nodemailer");

async function enviarTeste() {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
       user: "marcosv.paes10@gmail.com",      // 👉 coloque seu e-mail
        pass: "spynygrueuklbhbu"    // 👉 use App Password do Gmail
      }
    });

    await transporter.sendMail({
      from: '"Loja Teste" <seuemail@gmail.com>',
      to: "outroemail@dominio.com",
      subject: "🚀 Teste de envio Nodemailer",
      text: "Se você recebeu isso, seu Nodemailer está funcionando!",
    });

    console.log("✅ E-mail enviado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
}

enviarTeste();