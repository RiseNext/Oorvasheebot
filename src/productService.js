import axios from 'axios';

const BACKEND_URL = process.env.WEBSITE_BACKEND_URL;
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://oorvashee.com';

function cleanCode(messageText = '') {
  return String(messageText)
    .replace(/^code\s*:/i, '')
    .trim()
    .toUpperCase();
}

function formatPrice(price) {
  if (!price) return 'Contact Store';

  const priceText = String(price).trim();

  if (priceText.startsWith('₹')) {
    return priceText;
  }

  return `₹${priceText}`;
}

function buildProductLink(product) {
  if (product?.slug) {
    return `${WEBSITE_URL}/products/${product.slug}`;
  }

  return `${WEBSITE_URL}/search?q=${encodeURIComponent(
    product?.code || product?.productCode || ''
  )}`;
}

export async function findProductByCode(messageText = '') {
  try {
    const code = cleanCode(messageText);

    if (!code) {
      return null;
    }

    if (!BACKEND_URL) {
      console.error('WEBSITE_BACKEND_URL is missing');
      return null;
    }

    console.log(`Searching product: ${code}`);

    const url = `${BACKEND_URL}/api/v1/products?q=${encodeURIComponent(code)}`;

    const response = await axios.get(url, {
      timeout: 10000,
    });

    const items = response.data?.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      console.log(`No product found for code: ${code}`);
      return null;
    }

    const matchedProduct =
      items.find((product) => {
        const productCode = String(
          product.code ||
            product.product_code ||
            product.productCode ||
            product.sku ||
            ''
        )
          .trim()
          .toUpperCase();

        return productCode === code;
      }) || items[0];

    return {
      ...matchedProduct,
      code:
        matchedProduct.code ||
        matchedProduct.product_code ||
        matchedProduct.productCode ||
        matchedProduct.sku ||
        code,
      name:
        matchedProduct.name ||
        matchedProduct.title ||
        matchedProduct.productName ||
        'Oorvashee Saree',
      price: formatPrice(
        matchedProduct.base_price ||
          matchedProduct.price ||
          matchedProduct.sale_price ||
          matchedProduct.salePrice ||
          matchedProduct.mrp
      ),
      imageUrl:
        matchedProduct.primary_image_url ||
        matchedProduct.imageUrl ||
        matchedProduct.image_url ||
        matchedProduct.image ||
        matchedProduct.thumbnail ||
        matchedProduct.images?.[0]?.url ||
        matchedProduct.images?.[0] ||
        null,
      productLink:
        matchedProduct.productLink ||
        matchedProduct.product_link ||
        matchedProduct.url ||
        buildProductLink({ ...matchedProduct, code }),
    };
  } catch (error) {
    console.error('Product lookup error:', error?.response?.data || error.message);
    return null;
  }
}
