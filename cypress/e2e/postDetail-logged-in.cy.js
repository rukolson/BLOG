describe('PostDetail - Logged in user', () => {
  beforeEach(() => {
    window.localStorage.setItem('user', JSON.stringify({
      id: 'author123',
      name: 'Test User',
      token: 'fake-token'
    }));

    cy.intercept('GET', '**/posts/post123', {
      statusCode: 200,
      body: {
        _id: 'post123',
        title: 'Testowy post',
        description: '<p>Opis testowy</p>',
        thumbnail: 'test.jpg',
        creator: 'author123',
        createdAt: '2023-01-01T00:00:00Z'
      }
    }).as('getPost');

    cy.visit('/posts/post123');
    cy.wait('@getPost');
  });

  it('shows Edit and Delete buttons for an author', () => {
    cy.contains('Edit').should('be.visible');
    cy.contains('Delete').should('be.visible');
    cy.contains('Testowy post').should('be.visible');
    cy.get('.post-detail__thumbnail img').should('have.attr', 'src').and('include', 'test.jpg');
  });
});