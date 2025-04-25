describe('User Registration', () => {
  it('registers a new user and redirects to login', () => {
    const randomSuffix = Date.now(); 
    const testUser = {
      name: 'Test User',
      email: `testuser_${randomSuffix}@example.com`,
      password: 'Password123!',
      password2: 'Password123!'
    };

    cy.visit('/register');

    cy.get('input[name="name"]').type(testUser.name);
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('input[name="password2"]').type(testUser.password2);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');
  });
});