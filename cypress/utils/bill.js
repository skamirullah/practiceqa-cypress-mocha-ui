/**
 * Test oracle for the FoodDash bill. Expected amounts are worked out from the
 * published pricing rules instead of being typed into each test.
 */
const RULES = {
  deliveryFee: 35,
  freeDeliveryFrom: 499,
  taxRate: 0.05,
  promo: { code: 'FEAST50', rate: 0.5, max: 100, minOrder: 299 },
};

function expectedBill(items, { promo = false, tip = 0 } = {}) {
  const delivery = items >= RULES.freeDeliveryFrom ? 0 : RULES.deliveryFee;
  const discount = promo && items >= RULES.promo.minOrder ? Math.min(Math.round(items * RULES.promo.rate), RULES.promo.max) : 0;
  const taxes = Math.round((items - discount) * RULES.taxRate);
  return { items, delivery, discount, taxes, tip, total: items - discount + delivery + taxes + tip };
}

const rupees = (amount) => `₹${amount}`;

module.exports = { RULES, expectedBill, rupees };
