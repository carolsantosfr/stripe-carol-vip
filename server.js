// Importa as bibliotecas necessárias
const express = require('express');
const stripe = require('stripe');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis do ficheiro .env

// Inicializa o Stripe com a sua chave secreta
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Inicializa a aplicação Express
const app = express();

// Middlewares
app.use(cors()); // Permite que o front-end comunique com este servidor
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- ROTA DA API ---

// Rota para criar um "Payment Intent"
// O front-end chama esta rota assim que a página carrega para obter um "clientSecret"
app.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: 100, // O valor em CENTAVOS (R$ 9,90 = 990 centavos)
      currency: 'brl', // Moeda em Reais Brasileiros
      // Ativa métodos de pagamento automáticos, o Stripe decide quais mostrar
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Envia o client_secret de volta para o front-end
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Erro ao criar o Payment Intent:', error);
    res.status(500).json({ error: 'Não foi possível iniciar o pagamento.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
