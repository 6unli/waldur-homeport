describe('Project workspace', function () {
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
      .waitForSpinner()
      .get('h2')
      .should('exist')
      .waitForSpinner();
  });

  it('Should go to Marketplace page', () => {
    cy.get('a').contains('Marketplace').click();
    cy.get('h1').contains('Marketplace').should('exist', { matchCase: false });
  });

  it('Should go to My orders page', () => {
    cy.get('a').contains('My orders').click();
    cy.get('h2').contains('My orders').should('exist', { matchCase: false });
  });

  it('Should go to Resource category page', () => {
    cy.get('a').contains('Resources').click();
    cy.get('a').contains('HPC').click();
    cy.url().should('include', '/marketplace-resources/');
  });

  it('Should go to Audit logs page', () => {
    cy.get('a').contains('Audit logs').click();
    cy.get('h2').contains('Audit logs').should('exist', { matchCase: false });
  });

  it('Should go to Issues page', () => {
    cy.get('a').contains('Issues').click();
    cy.get('h2').contains('Issues').should('exist', { matchCase: false });
  });

  it('Should go to Team page', () => {
    cy.get('a').contains('Team').click();
    cy.get('h2').contains('Team').should('exist', { matchCase: false });
  });

  it('Should go back to Dashboard page', () => {
    cy.get('a').contains('My orders').click();
    cy.get('a').contains('Dashboard').click();
    cy.title().should('contain', 'Dashboard');
  });

  it('Should go back to Organization', () => {
    cy.get('a').contains('Back to organization').click();
    cy.url().should('include', '/organizations/').and('include', '/dashboard/');
  });

  it('Should validate navigation to profile pages via dropdown', () => {
    cy.get('.nav-header > .dropdown >.dropdown-toggle')
      .click()
      .get('.dropdown-menu')
      .find('li > a')
      .contains('SSH Keys', { matchCase: false })
      .click();
    cy.title().should('contain', 'SSH keys', { matchCase: false });
  });
});
