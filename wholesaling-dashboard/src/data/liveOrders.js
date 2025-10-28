let orderId = 1;

const products = ["Widgets", "Gadgets", "Doohickeys"];
const statuses = ["Pending", "Processing", "Shipped", "Delivered"];

export function generateOrder() {
  const product = products[Math.floor(Math.random() * products.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const quantity = Math.floor(Math.random() * 10) + 1;

  return {
    id: orderId++,
    product,
    quantity,
    status,
    timestamp: new Date().toLocaleTimeString(),
  };
}
