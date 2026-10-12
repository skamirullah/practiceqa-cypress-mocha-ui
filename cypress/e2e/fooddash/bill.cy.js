const checkoutPage = require('../../support/pages/checkoutPage');
const { cartWith } = require('../../support/flows');
const { RULES, expectedBill, rupees } = require('../../utils/bill');

describe('FoodDash: bill, delivery fee and coupon', () => {
  beforeEach(() => {
    cy.fixture('menu').as('menu');
  });

  it('charges a delivery fee on a small order', function () {
    const { pizzeria } = this.menu;
    const bill = expectedBill(pizzeria.garlicBread.price);

    cartWith(pizzeria.id, pizzeria.garlicBread.id);

    checkoutPage.bill('delivery').should('have.text', rupees(RULES.deliveryFee));
    checkoutPage.bill('taxes').should('have.text', rupees(bill.taxes));
    checkoutPage.bill('total').should('have.text', rupees(bill.total));
  });

  it('delivers free once the items pass the threshold', function () {
    const { pizzeria } = this.menu;

    cartWith(pizzeria.id, pizzeria.garlicBread.id, 4);

    checkoutPage.bill('items').should('have.text', rupees(pizzeria.garlicBread.price * 4));
    checkoutPage.bill('delivery').should('have.text', 'FREE');
  });

  it('rejects an unknown coupon', function () {
    cartWith(this.menu.pizzeria.id, this.menu.pizzeria.garlicBread.id);

    checkoutPage.applyPromo('FREEFOOD');

    checkoutPage.promoMessage().should('have.attr', 'role', 'alert').and('have.text', 'Invalid coupon');
    checkoutPage.bill('discount').should('not.exist');
  });

  it('tells the customer how much more to add before the coupon applies', function () {
    const { pizzeria } = this.menu;
    const shortBy = RULES.promo.minOrder - pizzeria.garlicBread.price;

    cartWith(pizzeria.id, pizzeria.garlicBread.id);
    checkoutPage.applyPromo(RULES.promo.code);

    checkoutPage.promoMessage().should('contain.text', `Add items worth ${rupees(shortBy)} more`);
  });

  it('caps the coupon discount at its maximum', function () {
    const { pizzeria } = this.menu;
    const bill = expectedBill(pizzeria.garlicBread.price * 4, { promo: true });

    cartWith(pizzeria.id, pizzeria.garlicBread.id, 4);
    checkoutPage.applyPromo('feast50');

    checkoutPage.bill('discount').should('have.text', `−${rupees(RULES.promo.max)}`);
    checkoutPage.bill('total').should('have.text', rupees(bill.total));
  });
});
