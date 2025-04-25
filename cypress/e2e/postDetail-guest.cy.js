describe('PostDetail - Guest', () => {
  beforeEach(() => {
    window.localStorage.removeItem('user');

    cy.intercept('GET', '**/posts/post123', {
      statusCode: 200,
      body: {
        _id: 'post123',
        title: 'Test post for guest',
        description: '<p>Publiczny opis</p>',
        thumbnail: 'guest.jpg',
        creator: 'author456',
        createdAt: '2023-01-01T00:00:00Z'
      }
    }).as('getPost');

    cy.visit('/posts/post123');
    cy.wait('@getPost');
  });

  it('does not show Edit and Delete buttons', () => {
    cy.contains('Edit').should('not.exist');
    cy.contains('Delete').should('not.exist');
    cy.contains('Testowy post dla gościa').should('be.visible');
    cy.get('.post-detail__thumbnail img').should('have.attr', 'src').and('include', 'guest.jpg');
  });
});