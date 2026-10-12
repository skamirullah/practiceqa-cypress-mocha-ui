const checkoutPage = require('../../support/pages/checkoutPage');
const menuPage = require('../../support/pages/menuPage');
const { cartWith } = require('../../support/flows');

describe('FoodDash: checkout validation', () => {
  beforeEach(() => {
    cy.fixture('menu').as('menu');
  });

  it('shows an empty state when there is nothing in the cart', { tags: '@smoke' }, () => {
    checkoutPage.visit();
    checkoutPage.emptyCart().should('be.visible').and('contain.text', 'Your cart is empty');
  });

  it('asks for an address, phone and payment method before placing the order', function () {
    cartWith(this.menu.pizzeria.id, this.menu.pizzeria.garlicBread.id);

    checkoutPage.placeOrder();

    checkoutPage.error('address').should('have.text', 'Choose a delivery address');
    checkoutPage.error('delivery-phone').should('have.text', 'Phone must be 10 digits');
    checkoutPage.error('pay').should('have.text', 'Choose a payment method');
    cy.location('pathname').should('eq', '/apps/food/checkout');
  });

  it('rejects a phone number that is not 10 digits', function () {
    cartWith(this.menu.pizzeria.id, this.menu.pizzeria.garlicBread.id);

    checkoutPage.deliverTo('work').phone('12345').payWith('card').placeOrder();

    checkoutPage.error('delivery-phone').should('have.text', 'Phone must be 10 digits');
    checkoutPage.error('address').should('not.exist');
  });

  it('refuses cash on delivery above the cash limit', function () {
    const { pizzeria, customer } = this.menu;

    // Two large pepperoni pizzas come to more than the ₹1,500 cash limit.
    menuPage.visit(pizzeria.id);
    menuPage.addCustomised(pizzeria.pepperoni.id, { size: 'large' }).confirmCustomised();
    menuPage.addCustomised(pizzeria.pepperoni.id, { size: 'large' }).confirmCustomised();
    menuPage.goToCheckout();

    checkoutPage.deliverTo('home').phone(customer.phone).payWith('cod').placeOrder();

    checkoutPage.error('pay').should('have.text', 'Cash on delivery is available up to ₹1,500');
  });
});
