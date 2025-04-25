describe('Logout', () => {
  it('clears currentUser and redirects to /login', () => {
    window.localStorage.setItem('user', JSON.stringify({
      id: '123',
      name: 'Test User',
      token: 'mock-token'
    }));

    cy.visit('/logout');

    cy.location('pathname').should('eq', '/login');

    cy.window().then((win) => {
      const user = win.localStorage.getItem('user');
      expect(user).to.be.null;
    });
  });
});