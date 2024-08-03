/// <reference types="cypress" />

describe('LoginSignup Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Update the URL to match where your app runs locally
  });

  it('should signup and then login', () => {
    // Step 1: Switch to signup form
    cy.get('.loginsignup-login span').click();

    // Intercept the signup API request
    cy.intercept('POST', 'http://localhost:3000/signup', {
      statusCode: 200,
      body: {
        success: true,
        token: 'fake-jwt-token',
      },
    }).as('signupRequest');

    // Fill in the signup form and submit
    cy.get('input[name="username"]').type('TestUser');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('#loginButton').click();

    // Wait for the signup request and verify token is stored
    cy.wait('@signupRequest').then((interception) => {
      expect(interception.response.body).to.have.property('token');
      expect(localStorage.getItem('auth-token')).to.eq('fake-jwt-token');
    });

    // Assert redirection after signup
    cy.url().should('eq', 'http://localhost:3000/');

    // Step 2: Log out if necessary to start login
    // This step is optional depending on your app’s behavior

    // Step 3: Switch back to login form
    cy.get('.loginsignup-login span').click();

    // Intercept the login API request
    cy.intercept('POST', 'http://localhost:3000/login', {
      statusCode: 200,
      body: {
        success: true,
        token: 'fake-jwt-token',
      },
    }).as('loginRequest');

    // Fill in the login form and submit
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('#loginButton').click();

    // Wait for the login request and verify token is stored
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.body).to.have.property('token');
      expect(localStorage.getItem('auth-token')).to.eq('fake-jwt-token');
    });

    // Assert redirection after login
    cy.url().should('eq', 'http://localhost:3000/');
  });
});
