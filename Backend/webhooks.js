const express = require('express');
const router = express.Router();

// ===============================
// APENAS ROTAS ESSENCIAIS PARA N8N
// ===============================

// GET - Testar conexão com N8N
router.get('/test', async (req, res) => {
  try {
    const payload = {
      evento: 'teste_conexao',
      timestamp: new Date().toISOString(),
      mensagem: 'Teste de conexão entre sistema e N8N',
      origem: 'sistema_local'
    };
    
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(process.env.N8N_WEBHOOK_URL || "https://sintesebio.app.n8n.cloud/webhook-test/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Event-Type": "teste"
      },
      body: JSON.stringify(payload),
    });
    
    const responseText = await response.text();
    
    res.json({
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Conexão com N8N funcionando!' : 'Erro na conexão com N8N',
      n8n_response: responseText,
      webhook_url: process.env.N8N_WEBHOOK_URL || "https://sintesebio.app.n8n.cloud/webhook-test/"
    });
    
  } catch (error) {
    console.error("❌ Erro no teste de conexão:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Falha no teste de conexão com N8N'
    });
  }
});

// POST - Simular venda (para teste manual)
router.post('/simular-venda', async (req, res) => {
  try {
    const vendaSimulada = {
      venda_id: Math.floor(Math.random() * 1000),
      nome: req.body.nome || 'Cliente Teste',
      email: req.body.email || 'teste@email.com',
      telefone: req.body.telefone || '(11) 99999-9999',
      total: req.body.total || 99.99,
      itens: req.body.itens || [
        {
          id: 1,
          produto_nome: 'Produto Teste',
          preco: 99.99
        }
      ]
    };

    console.log("🧪 Simulando venda para teste:", vendaSimulada);

    const payload = {
      evento: 'nova_venda_criada',
      timestamp: new Date().toISOString(),
      origem: 'simulacao_teste',
      venda: vendaSimulada
    };

    const fetch = (await import('node-fetch')).default;

    const response = await fetch(process.env.N8N_WEBHOOK_URL || "https://sintesebio.app.n8n.cloud/webhook-test/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Event-Type": "nova_venda",
        "X-Venda-ID": vendaSimulada.venda_id.toString()
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log("✅ Venda simulada enviada para N8N:", responseText);
      
      res.json({
        success: true,
        message: 'Venda simulada enviada para N8N com sucesso',
        venda_simulada: vendaSimulada,
        n8n_response: responseText
      });
    } else {
      throw new Error(`N8N retornou erro: ${response.status} - ${responseText}`);
    }

  } catch (error) {
    console.error("❌ Erro ao simular venda:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;