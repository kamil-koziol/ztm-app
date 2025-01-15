describe('See stops after login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should login, go to stops, and click Add button', () => {
    cy.contains('Login').click(); // Assuming the link text is 'Login'

    cy.url().should('include', '/login'); // Verify we are on the login page
    cy.get('input#username').type('test1234'); // Adjust selector if needed
    cy.get('input#password').type('test1234'); // Adjust selector if needed

    cy.get('form').submit();

    cy.url().should('include', '/'); // Adjust this to match your post-login redirect page

    cy.get('nav').should('contain', 'Logout');

    cy.contains('Stops').click(); // Adjust this based on the actual text or route

    cy.url().should('include', '/stops'); // Adjust this to match the correct path

    cy.contains('Add').click();
    cy.contains('Remove').click();
  });
});
