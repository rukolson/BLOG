describe('Header - Guest', () => {
  beforeEach(() => {
    window.localStorage.removeItem('user');
    cy.visit('/');
  });

  it('links for guest', () => {
    cy.contains('Login').should('be.visible');
    cy.contains('Authors').should('be.visible');
    cy.contains('Create Post').should('not.exist');
    cy.contains('Logout').should('not.exist');
  });
});