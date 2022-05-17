describe('Header and footer', function () {
  beforeEach(() => {
    cy.mockUser('admin')
      .setToken()
      .intercept('GET', '/api/customers/*', {
        fixture: 'customers/andersen.json',
      })
      .intercept('GET', '/api/projects/**', {
        fixture: 'projects/project-2.json',
      })
      .intercept('GET', '/api/marketplace-categories/?field=*', {
        fixture: 'marketplace/category-offerings.json',
      })
      .visit('projects/6628f38de458475baad6aa146f2ab406/')
      .get('.loading-title')
      .should('not.exist')
      .waitForSpinner();
  });

  it('Should go to support', () => {
    cy.get('a').contains('Support').click({ force: true });
    cy.url().should('contain', '/support/');
  });

  it('Should change language', () => {
    cy.get('a').contains('EN').click();
    cy.get('.dropdown-menu').contains('Eesti').click();
    cy.fixture('users/admin.json').then((user) => {
      const userName = user.full_name;
      cy.get('.loading-title').waitForSpinner();
      cy.get('h2')
        .contains('Tere tulemast ' + userName)
        .should('exist', { matchCase: false });
    });
  });

  it('Should go to Compare items page', () => {
    cy.get('a[href$="/marketplace-compare/"]').click({ force: true });
    cy.get('h2')
      .contains('Compare items')
      .should('exist', { matchCase: false });
  });

  it('Should go to Checkout page', () => {
    cy.get('a[href$="/marketplace-checkout/"]').click({ force: true });
    cy.get('h2').contains('Checkout').should('exist', { matchCase: false });
  });

  it('Should not display Compare and Checkout for User permissions', () => {
    cy.visit('/profile/')
      .get('.loading-title')
      .should('not.exist')
      .waitForSpinner();
    cy.get('h2');
    cy.get('a[href$="/marketplace-compare/"]').should('not.exist');
    cy.get('a[href$="/marketplace-checkout/"]').should('not.exist');
  });

  it('Should display version info', () => {
    cy.get('footer').should('contain', 'Version: develop');
  });

  it('Should display backend health info', () => {
    cy.get('footer')
      .contains('Version: develop')
      .find('a')
      .click()
      .waitForSpinner();
    cy.get('h3[class="modal-title"]').contains('Backend health status');
    cy.get('.modal-body > table > tbody > tr').should('not.have.length', '0');

    // can close after viewing
    cy.get('button')
      .contains('Cancel')
      .click()
      .get('.modal-content')
      .should('not.exist');
  });

  it('Should open Privacy Policy page', () => {
    cy.get('footer').contains('Privacy policy').click();
    cy.url().should('contain', '/policy/privacy/');
  });

  it('Should open Terms of Service page', () => {
    cy.get('footer').contains('Terms of Service').click();
    cy.url().should('contain', '/tos/');
  });

  it('Should log out', () => {
    cy.get('a').contains('Log out').click({ force: true });
    cy.url().should('include', '/login/');
  });
});
