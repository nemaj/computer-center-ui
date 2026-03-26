export const unformatCurrency = (value) => {
  if (typeof value === 'number') return value;
  return Number(value?.replace(/[^0-9.-]+/g, ""));
};

export const generateSku = (productName) => {
  // Take first 3 letters of category and product name
  const prodPart = productName.substring(0, 3).toUpperCase();
  
  // Random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  return `${prodPart}-${randomNum}`;
};