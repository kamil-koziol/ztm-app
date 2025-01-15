import { v4 as uuidv4 } from 'uuid';

describe('Navbar', () => {
  beforeEach(() => {
    // Visit the homepage (adjust this if your app has a different route)
    cy.visit('/');
  });

  it('should navigate to login, login, and then see logout in navbar', () => {
    // 1. Go to the login page
    cy.contains('Login').click(); // Assuming the link text is 'Login'

    // 2. On the login page, fill in the credentials and submit the form
    cy.url().should('include', '/login'); // Verify we are on the login page
    cy.get('input#username').type('test1234'); // Adjust selector if needed
    cy.get('input#password').type('test1234'); // Adjust selector if needed

    // Submit the form
    cy.get('form').submit();

    // 3. Verify the navigation after login (redirected to home page, for example)
    cy.url().should('include', '/'); // Adjust this to match your post-login redirect page

    // 4. After login, the navbar should show the 'Logout' link
    cy.get('nav').should('contain', 'Logout');
  });

  it('should navigate to register, register, and then see logout in navbar', () => {
    // 1. Go to the register page
    cy.contains('Register').click(); // Assuming the link text is 'Register'

    // 2. On the register page, fill in the registration form and submit
    cy.url().should('include', '/register'); // Verify we are on the register page
    cy.get('input#username').type(uuidv4()); // Adjust selector if needed
    cy.get('input#password').type('newpassword123'); // Adjust selector if needed

    // Submit the form
    cy.get('form').submit();

    // 3. Verify the navigation after register (redirected to home page, for example)
    cy.url().should('include', '/'); // Adjust this to match your post-register redirect page

    // 4. After registering, the navbar should show the 'Logout' link
    cy.get('nav').should('contain', 'Logout');
  });
});
