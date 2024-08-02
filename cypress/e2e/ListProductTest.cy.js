describe('ListProduct Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/listproduct'); // Adjust URL if necessary
  });

  it('should display the product list header', () => {
    cy.contains('All Product List').should('exist');
  });

  it('should fetch and display products', () => {
    cy.intercept('GET', 'http://localhost:4000/allproducts', {
      fixture: 'products.json' // Provide a fixture for testing
    }).as('getAllProducts');

    cy.wait('@getAllProducts').then((interception) => {
      assert.isNotNull(interception.response.body, 'GET allproducts API call has data');
    });

    cy.get('.listproduct-format-main').should('have.length.at.least', 1);
  });

  it('should remove a product', () => {
    cy.intercept('POST', 'http://localhost:4000/removeproduct', { success: true }).as('removeProduct');

    cy.get('.listproduct-remove-icon').first().click();
    cy.wait('@removeProduct').then((interception) => {
      assert.isTrue(interception.response.body.success, 'Product removed successfully');
    });

    cy.get('.listproduct-format-main').should('have.length.at.least', 1);
  });
});
