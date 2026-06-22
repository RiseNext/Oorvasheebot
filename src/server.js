import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { findProductByCode } from './productService.js';
import { sendTextMessage, sendImageMessage } from './whatsappService.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'oorvasi_verify_123';
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://oorvashee.com';

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Oorvashee WhatsApp Bot API Running',
    website: WEBSITE_URL,
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/test/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const product = await findProductByCode(code);

    if (!product) {
      return res.status(404).json({
        status: 'not_found',
        message: 'Product code not found',
        code: code.toUpperCase(),
      });
    }

    return res.status(200).json({
      status: 'success',
      product,
    });
  } catch (error) {
    console.error('Test route error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Product lookup failed',
    });
  }
});

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text =
  message?.text?.body?.trim() ||
  message?.image?.caption?.trim() ||
  message?.document?.caption?.trim();

    if (!from || !text) return res.sendStatus(200);

    console.log(`Incoming message from ${from}: ${text}`);

    const lowerText = text.toLowerCase();
    const isGreeting = ['hi', 'hii', 'hello', 'hey', 'menu', 'start'].includes(lowerText);

    if (isGreeting) {
      await sendTextMessage(
        from,
`👋 Welcome to Oorvashee Saree House

✨ Discover our exclusive collection of:

👗 Silk Sarees
👗 Cotton Sarees
👗 Designer Sarees
👗 Bridal Collections
👗 Traditional Handloom Sarees

📌 To get product details instantly, simply send the Saree Code.

Example:
FC14-799

You will receive:

✅ Product Image
✅ Product Name
✅ Price Details
✅ Direct Shopping Link

🌐 Website:
${WEBSITE_URL}

💖 Thank you for choosing Oorvashee Saree House.

🙏 Happy Shopping!`
      );

      return res.sendStatus(200);
    }

    const product = await findProductByCode(text);

    if (!product) {
      await sendTextMessage(
        from,
`❌ Sorry, we could not find the saree code you entered.

📌 Please verify the code and try again.

Example:
FC14-799

🌐 Browse our latest collection:
${WEBSITE_URL}

💖 Thank you for visiting Oorvashee Saree House.`
      );

      return res.sendStatus(200);
    }

    const productCaption = `👗 ${product.name}

📌 Product Code: ${product.code}
💰 Price: ${typeof product.price === 'number' ? `₹${product.price}` : product.price}

🛍 Shop Now:
${product.productLink}

💖 Thank you for shopping with Oorvashee Saree House.

🌐 ${WEBSITE_URL}`;

 await sendTextMessage(from, productCaption);

    return res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error?.response?.data || error.message);
    return res.sendStatus(200);
  }
});

app.listen(PORT, () => {
  console.log(`Oorvashee WhatsApp Bot running on port ${PORT}`);
});
