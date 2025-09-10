const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');
const helmet = require('helmet'); // npm install helmet
const rateLimit = require('express-rate-limit'); // npm install express-rate-limit
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;

// ===============================
// Segurança - Helmet
// ===============================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// ===============================
// CORS Configurado (não permite tudo)
// ===============================
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      process.env.FRONTEND_URL, // Adicione a URL do seu frontend
      // Adicione outras origens confiáveis aqui
    ].filter(Boolean); // Remove undefined values

    // Permitir requisições sem origin (ex: Postman, mobile apps)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ===============================
// Rate Limiting
// ===============================
// Limite geral para todas as rotas
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

// Limite específico para webhooks
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 requisições por minuto
  message: 'Limite de requisições para webhook excedido.'
});

app.use('/api/', limiter);
app.use('/api/webhook/', webhookLimiter);

// ===============================
// Body Parser com limite de tamanho
// ===============================
app.use(bodyParser.json({ limit: '10mb' })); // Limite de 10MB
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ===============================
// Middleware de Autenticação para Webhooks
// ===============================
const authenticateWebhook = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.WEBHOOK_API_KEY;

  // Se não houver chave configurada, permite (desenvolvimento)
  if (!expectedKey) {
    console.warn('⚠️ WEBHOOK_API_KEY não configurada - webhook desprotegido!');
    return next();
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      error: 'Não autorizado',
      message: 'API Key inválida ou ausente'
    });
  }

  next();
};

// ===============================
// Validação de Dados
// ===============================
const validateVendaData = (data) => {
  // Validação básica de estrutura
  if (!data || typeof data !== 'object') {
    throw new Error('Dados inválidos');
  }

  // Validar campos obrigatórios
  const requiredFields = ['venda_id', 'nome', 'email', 'total'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }

  // Validar tipos
  if (typeof data.total !== 'number' || data.total < 0) {
    throw new Error('Total deve ser um número positivo');
  }

  // Validar email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Email inválido');
  }

  // Sanitizar strings para prevenir XSS
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>]/g, '');
  };

  return {
    ...data,
    nome: sanitizeString(data.nome),
    email: sanitizeString(data.email),
    telefone: data.telefone ? sanitizeString(data.telefone) : ''
  };
};

// ===============================
// Logging Seguro
// ===============================
const secureLog = (message, data = {}) => {
  // Remove dados sensíveis antes de logar
  const sanitized = { ...data };
  delete sanitized.senha;
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.apiKey;

  console.log(message, sanitized);
};

// ===============================
// Rotas
// ===============================
const produtosRoutes = require('./produtos');
const webhookRoutes = require('./webhooks');

app.use('/api/produtos', produtosRoutes);
app.use('/api/webhook', authenticateWebhook, webhookRoutes); // Com autenticação

// Health check sem expor informações sensíveis
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando',
    timestamp: new Date().toISOString()
    // NÃO expor webhook_url ou outras configs
  });
});

// ===============================
// Error Handler Global
// ===============================
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);

  // Não expor detalhes do erro em produção
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: 'Erro no servidor',
    message: isDevelopment ? err.message : 'Erro interno do servidor',
    ...(isDevelopment && { stack: err.stack })
  });
});

// ===============================
// Listener do Postgres (Supabase) - Com tratamento seguro
// ===============================
if (process.env.DATABASE_URL) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  let tentativasConexao = 0;
  const maxTentativas = 3;

  async function conectarListener() {
    tentativasConexao++;

    try {
      await client.connect();
      secureLog("🔔 Conectado ao Postgres para ouvir eventos");
      await client.query("LISTEN nova_venda");
      secureLog("👂 Escutando canal 'nova_venda'");

      tentativasConexao = 0;

    } catch (err) {
      console.error(`❌ Erro ao conectar listener (tentativa ${tentativasConexao}/${maxTentativas})`);

      if (tentativasConexao < maxTentativas) {
        setTimeout(conectarListener, 5000);
      } else {
        console.error("🛑 Máximo de tentativas atingido");
      }
    }
  }

  conectarListener();

  client.on("notification", async (msg) => {
    try {
      // Parse com try-catch para evitar crash
      let vendaData;
      try {
        vendaData = JSON.parse(msg.payload);
      } catch (parseError) {
        console.error("❌ Erro ao fazer parse do payload:", parseError);
        return;
      }

      // Validar dados antes de processar
      try {
        vendaData = validateVendaData(vendaData);
      } catch (validationError) {
        console.error("❌ Dados inválidos:", validationError.message);
        return;
      }

      secureLog("💰 Nova venda processada", {
        venda_id: vendaData.venda_id,
        cliente: vendaData.nome
      });

      // Preparar payload para N8N
      const payloadN8N = {
        evento: 'nova_venda_criada',
        timestamp: new Date().toISOString(),
        origem: 'supabase_function',
        venda: vendaData,
        // Adicionar assinatura para verificação de integridade
        signature: crypto
          .createHmac('sha256', process.env.WEBHOOK_SECRET || 'default-secret')
          .update(JSON.stringify(vendaData))
          .digest('hex')
      };

      // Enviar para N8N
      const fetch = (await import('node-fetch')).default;

      const response = await fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { 

          "Content-Type": "application/json",
          "X-N8N-Auth": process.env.WEBHOOK_API_KEY || ''
        },
        body: JSON.stringify(payloadN8N),
        timeout: 10000 // Timeout de 10 segundos
      });

      if (response.ok) {
        secureLog(`✅ Venda ${vendaData.venda_id} enviada para N8N`);
      } else {
        console.error(`❌ Erro N8N (${response.status})`);
      }

    } catch (error) {
      console.error("❌ Erro ao processar notificação:", error.message);
    }
  });

  client.on('error', (err) => {
    console.error('❌ Erro na conexão do listener');

    if (tentativasConexao < maxTentativas) {
      setTimeout(conectarListener, 3000);
    }
  });

  // Graceful shutdown melhorado
  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} recebido. Iniciando shutdown gracioso...`);

    try {
      // Fechar listener do Postgres
      if (client) {
        await client.end();
        console.log('✅ Listener do Postgres fechado');
      }

      // Fechar servidor Express
      server.close(() => {
        console.log('✅ Servidor HTTP fechado');
        process.exit(0);
      });

      // Forçar saída após 10 segundos
      setTimeout(() => {
        console.error('❌ Forçando saída após timeout');
        process.exit(1);
      }, 10000);

    } catch (error) {
      console.error('❌ Erro durante shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

} else {
  console.log("⚠️ DATABASE_URL não configurado - listener desabilitado");
}

// ===============================
// Iniciar servidor com tratamento de erro
// ===============================
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);

  if (process.env.NODE_ENV === 'production') {
    console.log('🔒 Rodando em modo PRODUÇÃO - Segurança ativada');
  } else {
    console.log('⚠️ Rodando em modo DESENVOLVIMENTO');
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso!`);
    process.exit(1);
  }
  console.error('❌ Erro ao iniciar servidor:', err);
});