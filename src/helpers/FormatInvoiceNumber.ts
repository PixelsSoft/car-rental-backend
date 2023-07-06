function formatInvoiceNumber(number: number) {
  const paddingSize = 4; // Adjust the padding size as needed
  return number.toString().padStart(paddingSize, "0");
}

export default formatInvoiceNumber;
