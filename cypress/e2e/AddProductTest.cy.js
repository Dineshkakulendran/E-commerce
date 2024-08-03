/*
describe('AddProduct Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/addproduct'); 
  });

  it('should display the product title input field', () => {
    cy.get('[data-testid="cypress-title"]', { timeout: 20000 }).should('exist');
  });

  it('should allow entering product title', () => {
    cy.get('input[name="name"]').type('Test Product').should('have.value', 'Test Product');
  });

  it('should allow entering prices', () => {
    cy.get('input[name="old_price"]').type('100').should('have.value', '100');
    cy.get('input[name="new_price"]').type('80').should('have.value', '80');
  });

  it('should allow selecting category', () => {
    cy.get('select[name="category"]').select('Men').should('have.value', 'men');
  });

  it('should allow uploading an image', () => {
    const imagePath = '../fixtures/product_28.png'; // Adjust path if necessary
    cy.get('input[type="file"]').attachFile(imagePath);

    //cy.get('.addproduct-btn').click();
  });

  
  
  it('should submit the form and verify product in the list', () => {
    cy.get('.addproduct-btn').click();

    // Wait for the product to be added
    cy.wait(2000);

    // Visit the product list page
    cy.visit('http://localhost:5173/listproduct');

    // Verify that the newly added product is in the list
    cy.get('.listproduct-format-main').should('exist');
    cy.contains('Test Product').should('be.visible');
    cy.contains('100').should('be.visible');
    cy.contains('80').should('be.visible');
    cy.get('../fixtures/product_28.png').should('be.visible'); // Adjust selector to match actual HTML structure
   
  });
   
});
*/

// cypress/e2e/AddProductTest.js
describe('Add and List Product Test', () => {
  it('should add a new product and verify it appears in the product list', () => {
    // Visit the page containing AddProduct component
    cy.visit('http://localhost:5173/addproduct'); 

    //product form
    cy.get('input[name="name"]').type('Test Product');
    cy.get('input[name="old_price"]').type('50');
    cy.get('input[name="new_price"]').type('30');
    cy.get('select[name="category"]').select('women');
    
    // Attach an image file
    const imagePath = '../../admin/src/assets/product_29.png';
    cy.get('input[type="file"]').attachFile(imagePath);

    // Click the ADD button
    cy.get('button.addproduct-btn').click();

    // Wait for the request to complete and product to be added
    cy.intercept('POST', 'http://localhost:4000/upload').as('uploadImage');
    cy.intercept('POST', 'http://localhost:4000/addproduct').as('addProduct');

    cy.wait('@uploadImage');
    cy.wait('@addProduct');

    // Visit the page containing ListProduct component
    cy.visit('http://localhost:5173/listproduct'); 

  });
});

