describe('AuthorPosts', () => {
  it('displays posts for the author if they exist', () => {
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/posts/users/*`, {
      statusCode: 200,
      body: [
        {
          _id: '123',
          title: 'Post 1',
          category: 'Tech',
          description: 'This is the description for Post 1',
          creator: '456',
          thumbnail: 'thumbnail1.jpg',
          createdAt: '2021-01-01',
        },
        {
          _id: '124',
          title: 'Post 2',
          category: 'Lifestyle',
          description: 'This is the description for Post 2',
          creator: '456',
          thumbnail: 'thumbnail2.jpg',
          createdAt: '2021-01-02',
        },
      ],
    }).as('getPosts');

    cy.visit('/author/456');

    cy.wait('@getPosts');

    cy.get('.posts__container').should('exist');
    cy.get('.posts__container').find('.post-item').should('have.length', 2);

    cy.get('.post-item').eq(0).should('contain.text', 'Post 1');
    cy.get('.post-item').eq(1).should('contain.text', 'Post 2');
  });

  it('shows a loading spinner while fetching posts', () => {
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/posts/users/*`, {
      statusCode: 200,
      delayMs: 1000,
      body: [],
    }).as('getPostsDelayed');

    cy.visit('/author/456');

    cy.get('.loader').should('be.visible');

    cy.wait('@getPostsDelayed');

    cy.get('.loader').should('not.exist');
  });

  it('displays a "No posts found" message if there are no posts for the author', () => {
    cy.intercept('GET', `${Cypress.env('REACT_APP_BASE_URL')}/posts/users/*`, {
      statusCode: 200,
      body: [],
    }).as('getNoPosts');

    cy.visit('/author/789');

    cy.wait('@getNoPosts');

    cy.get('h2.center').should('contain.text', 'No posts found for this user');
  });
});