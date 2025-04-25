describe('Header - Logged in user', () => {
  beforeEach(() => {
    window.localStorage.setItem('user', JSON.stringify({
      id: 'abc123',
      name: 'Jan Kowalski',
      token: 'fake-jwt-token'
    }));

    cy.visit('/');
  });

  it('links for logged in user', () => {
    cy.contains('Jan Kowalski').should('be.visible');
    cy.contains('Create Post').should('be.visible');
    cy.contains('Authors').should('be.visible');
    cy.contains('Logout').should('be.visible');
    cy.contains('Login').should('not.exist');
  });
});