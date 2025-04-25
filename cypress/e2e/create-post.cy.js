describe('Create Post Page', () => {

  beforeEach(() => {
    cy.request('POST', 'http://localhost:5000/api/users/login', {
      email: 'testuser@example.com',
      password: 'password123'
    }).then((response) => {
      window.localStorage.setItem('user', JSON.stringify(response.body));
    });

    cy.visit('/create-post');
  });

  it('should render form and submit a new post', () => {
    cy.get('input[placeholder="Title"]').type('Test Post Title');

    cy.get('select[name="category"]').select('Education');

    cy.get('.ql-editor').type('This is a test description for the post.');

    cy.fixture('sample-image.jpg').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'sample-image.jpg',
        mimeType: 'image/jpeg'
      });
    });

    cy.get('button[type="submit"]').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('should show an error if no thumbnail is selected', () => {
    cy.get('input[placeholder="Title"]').type('Post bez miniaturki');
    cy.get('.ql-editor').type('Opis posta bez miniaturki');

    cy.get('button[type="submit"]').click();

    cy.get('.form__error-message').should('contain', 'Please choose a thumbnail');
  });
});