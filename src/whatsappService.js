import axios from 'axios';

const graphBaseUrl = 'https://graph.facebook.com/v20.0';

function getWhatsAppConfig() {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error('Missing WHATSAPP_TOKEN or PHONE_NUMBER_ID in environment variables.');
  }

  return { token, phoneNumberId };
}

export async function sendTextMessage(to, body) {
  const { token, phoneNumberId } = getWhatsAppConfig();

  return axios.post(
    `${graphBaseUrl}/${phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        preview_url: true,
        body
      }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

export async function sendImageMessage(to, imageUrl, caption) {
  const { token, phoneNumberId } = getWhatsAppConfig();

  return axios.post(
    `${graphBaseUrl}/${phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: {
        link: imageUrl,
        caption
      }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
}
export async function sendTrackingUpdate(
  to,
  orderId,
  status,
  trackingId,
  trackingUrl
) {
  const message = `📦 Oorvashee Order Update

Order ID: ${orderId}

Status: ${status}

Tracking ID: ${trackingId}

Track Shipment:
${trackingUrl}

Thank you for shopping with Oorvashee.`;

  return sendTextMessage(to, message);
}
