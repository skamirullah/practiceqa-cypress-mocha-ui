const restaurantsPage = require('../../support/pages/restaurantsPage');
const menuPage = require('../../support/pages/menuPage');
const checkoutPage = require('../../support/pages/checkoutPage');
const trackingPage = require('../../support/pages/trackingPage');
const { expectedBill, rupees } = require('../../utils/bill');

describe('FoodDash: placing an order', () => {
  beforeEach(() => {
    cy.fixture('menu').as('menu');
  });

  it('orders a customised pizza and tracks it to delivery', { tags: '@smoke' }, function () {
    const { pizzeria, customer } = this.menu;
    const pizza = pizzeria.margherita.price + pizzeria.sizes.medium + pizzeria.toppings.olives;
    const bill = expectedBill(pizza + pizzeria.garlicBread.price * 2, { promo: true, tip: 20 });

    restaurantsPage.visit().filterByCuisine(pizzeria.cuisine).open(pizzeria.id);

    menuPage.addCustomised(pizzeria.margherita.id, { size: 'medium', toppings: ['olives'] });
    menuPage.customTotal().should('contain.text', rupees(pizza));
    menuPage.confirmCustomised().add(pizzeria.garlicBread.id, 2);
    menuPage.quantity(pizzeria.garlicBread.id).should('have.text', '2');
    menuPage.cartCount().should('contain.text', '3');
    menuPage.goToCheckout();

    checkoutPage.applyPromo('FEAST50').tip(20);
    checkoutPage.promoMessage().should('contain.text', 'applied');
    checkoutPage.bill('delivery').should('have.text', 'FREE');
    checkoutPage.bill('total').should('have.text', rupees(bill.total));
    checkoutPage.deliverTo('home').phone(customer.phone).payWith('upi').placeOrder();

    trackingPage.confirmation().should('be.visible');
    trackingPage.orderId().invoke('text').should('match', /FD\d{8}/);
    trackingPage.status().should('contain.text', 'Preparing');
    trackingPage.status().should('contain.text', 'Out for delivery');
    trackingPage.status().should('contain.text', 'Delivered');
  });

  it('shows the size and toppings on the cart line', function () {
    const { pizzeria } = this.menu;

    menuPage.visit(pizzeria.id).addCustomised(pizzeria.pepperoni.id, { size: 'large', toppings: ['paneer'] }).confirmCustomised();
    menuPage.goToCheckout();

    checkoutPage.cartLines().should('have.length', 1);
    cy.getByTestId('line-customisation').should('contain.text', 'large').and('contain.text', 'paneer');
    checkoutPage.bill('items').should('have.text', rupees(pizzeria.pepperoni.price + pizzeria.sizes.large + pizzeria.toppings.paneer));
  });
});
