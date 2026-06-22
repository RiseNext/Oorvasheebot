# Oorvasi WhatsApp Bot

Simple WhatsApp Cloud API bot for Oorvasi Sarees e-commerce website.

## Features

- Welcome message for `Hi`, `Hello`, `Menu`, `Start`
- Customer sends saree code like `ORV001`
- Bot replies with product name, price, image, and direct website link
- Customer orders directly from website
- Product data stored in `data/products.json`
- Render-ready backend

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open:

```txt
http://localhost:5000
```

## Environment Variables

Create `.env` file:

```env
PORT=5000
VERIFY_TOKEN=oorvasi_verify_123
WHATSAPP_TOKEN=your_meta_access_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WEBSITE_URL=https://oorvashee-arz7zp4y6-risenexts-projects.vercel.app
```

## Render Deployment

1. Upload this project to GitHub.
2. Go to Render > New Web Service.
3. Connect GitHub repository.
4. Build Command:

```bash
npm install
```

5. Start Command:

```bash
npm start
```

6. Add environment variables from `.env.example`.
7. Deploy.

## WhatsApp Cloud API Webhook

After Render deployment, use this webhook URL in Meta Developer Console:

```txt
https://YOUR-RENDER-LINK.onrender.com/webhook
```

Verify Token:

```txt
oorvasi_verify_123
```

Use the same value in Render environment variable `VERIFY_TOKEN`.

## Update Products

Edit `data/products.json`:

```json
{
  "code": "ORV001",
  "name": "Premium Kanchipuram Silk Saree",
  "price": "2499",
  "imageUrl": "https://your-image-link.jpg",
  "productLink": "https://your-website/product/ORV001"
}
```

Important: Product code matching is exact. Customer must send only the code, like `ORV001`.

## Test Flow

Send WhatsApp message:

```txt
Hi
```

Bot replies with welcome message.

Send:

```txt
ORV001
```

Bot replies with product image, price, and order link.
"# Oorvasheebot" 
