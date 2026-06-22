import axios from 'axios';

const BACKEND_URL = process.env.WEBSITE_BACKEND_URL;
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://oorvashee.com';

function cleanCode(messageText = '') {
  return messageText.replace(/^code\s*:/i, '').trim().toUpperCase();
}

export async function findProductByCode(messageText = '') {
  try {
    const code = cleanCode(messageText);

    if (!BACKEND_URL) {
      console.error('WEBSITE_BACKEND_URL is missing');
      return null;
    }

    console.log(`Searching product: ${code}`);

    const url = `${BACKEND_URL}/api/v1/products?q=${encodeURIComponent(code)}`;
    const response = await axios.get(url, { timeout: 10000 });

    const items = response.data?.items || [];

    if (!items.length) {
      return null;
    }

    const product = items[0];

    return {
      ...product,
      code,
      name: product.name || 'Oorvashee Saree',
      price: product.base_price || 'Contact Store',
      imageUrl: product.primary_image_url || null,
      productLink: `${WEBSITE_URL}/products/${product.slug}`,
    };
  } catch (error) {
    console.error('Product lookup error:', error?.response?.data || error.message);
    return null;
  }
}
