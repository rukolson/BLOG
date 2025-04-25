describe('DeletePost', () => {
  it('renders the component and logs', () => {
    const testId = '1234567890abcdef';

    cy.visit(`/posts/delete/${testId}`);

    cy.get('div').should('exist');

    cy.url().should('include', `/posts/delete/${testId}`);

    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'log').as('consoleLog');
    });

    cy.get('@consoleLog').should('have.been.called');
  });
});