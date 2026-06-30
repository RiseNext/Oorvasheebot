import { sendTrackingUpdate } from './whatsappService.js';

export async function processTrackingUpdate(data) {
  const {
    phone,
    orderId,
    status,
    trackingId,
    trackingUrl
  } = data;

  return sendTrackingUpdate(
    phone,
    orderId,
    status,
    trackingId,
    trackingUrl
  );
}