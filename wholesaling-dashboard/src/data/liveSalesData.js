// Generates random sales data every refresh
export function generateSalesData() {
  const products = ["Widgets", "Gadgets", "Doohickeys"];
  return products.map(product => ({
    product,
    sales: Math.floor(Math.random() * 100) + 1, // random 1–100
  }));
}