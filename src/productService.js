import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, '../data/products.json');

export function getProducts() {
  try {
    const raw = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read products.json:', error.message);
    return [];
  }
}

export function findProductByCode(messageText = '') {
  const cleanedText = messageText.trim().toUpperCase();
  const products = getProducts();

  return products.find((product) => {
    return String(product.code).trim().toUpperCase() === cleanedText;
  });
}
