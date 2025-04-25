describe('EditPost Component', () => {
  let token;
  let testPostId;

  before(() => {
    cy.request('POST', 'http://localhost:5000/api/users/login', {
      email: 'testuser@example.com',
      password: 'password123',
    }).then((res) => {
      token = res.body.token;

      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/posts',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: 'Original Title',
          category: 'Business',
          description: 'Original description content',
        },
      }).then((postRes) => {
        testPostId = postRes.body._id;
      });
    });
  });

  it('should load and edit a post successfully', () => {
    window.localStorage.setItem(
      'user',
      JSON.stringify({ token, email: 'testuser@example.com' })
    );

    cy.visit(`/posts/edit/${testPostId}`);

    cy.get('input[placeholder="Title"]').should('have.value', 'Original Title');

    cy.get('input[placeholder="Title"]').clear().type('Updated Title');
    cy.get('select[name="category"]').select('Education');
    cy.get('.ql-editor').clear().type('Updated post description');

    cy.fixture('sample-image.jpg').then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'sample-image.jpg',
        mimeType: 'image/jpeg',
      });
    });

    cy.get('button[type="submit"]').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});