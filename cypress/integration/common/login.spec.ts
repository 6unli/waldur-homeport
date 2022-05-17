describe('Login page functionalities', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/customers/bf6d515c9e6e445f9c339021b30fc96b/', {
      fixture: 'customers/alice.json',
    })
      .intercept('GET', '/api/customers/', {
        fixture: 'customers/alice_bob_web.json',
      })
      .intercept('GET', '/api/projects/df4193e2bee24a4c8e339474d74c5f8c/', {
        fixture: 'projects/alice_azure.json',
      });
  });

  it('Should accept cookies', () => {
    cy.mockUser().visit('/login/');
    cy.get('.btn-primary').contains('Got it').click();
    cy.contains('This website uses cookies').should('not.exist');
  });

  it('Should open Privacy Policy page', () => {
    cy.mockUser().visit('/login/');
    cy.get('p').contains('Privacy policy').click();
    cy.url().should('contain', '/policy/privacy/');
  });

  it('Should open Terms of Service page', () => {
    cy.mockUser().visit('/login/');
    cy.get('p').contains('Terms of Service').click();
    cy.url().should('contain', '/tos/');
  });

  it('Should log in via username-password', () => {
    cy.mockUser().visit('/login/');
    cy.fillAndSubmitLoginForm();
    cy.url().should('contain', '/profile/');
  });

  it('Should display error with incorrect username-password', () => {
    cy.intercept('GET', '/api/configuration/', {
      fixture: 'configuration.json',
    }).intercept('POST', '/api-auth/password/', {
      statusCode: 401,
      body: { detail: 'Invalid username/password.' },
    });
    cy.visit('/login/');
    cy.fillAndSubmitLoginForm();
    cy.get('p').contains('Invalid username/password').should('exist');
  });
});
