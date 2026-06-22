import axios from "axios";

const BACKEND_URL = process.env.WEBSITE_BACKEND_URL;
const WEBSITE_URL = process.env.WEBSITE_URL || "https://oorvashee.com";

function cleanCode(messageText = "") {
  return messageText
    .replace(/^code\s*:/i, "")
    .trim()
    .toUpperCase();
}

export async function findProductByCode(messageText = "") {
  try {
    const code = cleanCode(messageText);

    console.log(`Searching product: ${code}`);

    const urls = [
      `${BACKEND_URL}/api/products/search?q=${encodeURIComponent(code)}`,
      `${BACKEND_URL}/api/products?search=${encodeURIComponent(code)}`,
      `${BACKEND_URL}/api/products/${encodeURIComponent(code)}`,
    ];

    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          timeout: 10000,
        });

        const data = response.data;

        const products =
          data?.products ||
          data?.items ||
          data?.data ||
          data?.results ||
          data;

        const list = Array.isArray(products) ? products : [products];

        const product =
          list.find((p) => {
            const pCode = String(
              p?.code || p?.productCode || p?.sku || ""
            )
              .trim()
              .toUpperCase();

            return pCode === code;
          }) || list[0];

        if (product) {
          return {
            ...product,
            code: product.code || product.productCode || code,
            name:
              product.name ||
              product.title ||
              product.productName ||
              "Oorvashee Saree",
            price:
              product.price ||
              product.salePrice ||
              product.mrp ||
              "Contact Store",
            imageUrl:
              product.imageUrl ||
              product.image ||
              product.thumbnail ||
              product.images?.[0]?.url ||
              product.images?.[0] ||
              null,
            productLink:
              product.productLink ||
              product.link ||
              product.url ||
              `${WEBSITE_URL}/search?q=${encodeURIComponent(code)}`,
          };
        }
      } catch (err) {
        console.log(`Failed URL: ${url}`);
      }
    }

    return null;
  } catch (error) {
    console.error("Product lookup error:", error.message);
    return null;
  }
}
