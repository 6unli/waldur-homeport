describe('User workspace', function () {
  beforeEach(() => {
    cy.mockUser('admin')
      .setToken()
      .visit('/profile/')
      .get('.loading-title')
      .should('not.exist')
      .waitForSpinner()
      .get('h2')
      .should('exist');
  });

  it('Should go to Audit logs page', () => {
    cy.get('a').contains('Audit logs').click();
    cy.title().should('contain', 'Audit logs');
  });

  it('Should go to SSH keys page', () => {
    cy.get('a').contains('SSH Keys').click();
    cy.title().should('contain', 'SSH keys');
  });

  it('Should go to Notifications page', () => {
    cy.get('a').contains('Notifications').click();
    cy.title().should('contain', 'Notifications');
  });

  it('Should go to Manage user page', () => {
    cy.get('a').contains('Manage').click();
    cy.title().should('contain', 'Manage');
  });

  it('Should go to FreeIPA page', () => {
    cy.get('a').contains('FreeIPA account').click();
    cy.title().should('contain', 'FreeIPA account');
  });

  it('Should go to Remote accounts page', () => {
    cy.get('a').contains('Remote accounts').click();
    cy.title().should('contain', 'Remote accounts');
  });

  it('Should go to Permission requests page', () => {
    cy.get('a').contains('Permission requests').click();
    cy.title().should('contain', 'Permission requests');
  });

  it('Should go back to Dashboard page', () => {
    cy.get('a').contains('Audit logs').click();
    cy.get('a').contains('Dashboard').click();
    cy.title().should('contain', 'User dashboard');
  });

  it('Should go to Dashboard via logo', () => {
    cy.get('a').contains('Audit logs').click();
    cy.get('.brand-name > a').click();
    cy.title().should('contain', 'User dashboard');
  });

  it('Should validate navigation via dropdown', () => {
    cy.get('.nav-header > .dropdown >.dropdown-toggle')
      .click()
      .get('.dropdown-menu')
      .find('li > a')
      .contains('Notifications')
      .click();
    cy.title().should('contain', 'Notifications');
  });

  it('Should validate logout function via dropdown', () => {
    cy.get('.nav-header > .dropdown >.dropdown-toggle')
      .click()
      .get('.dropdown-menu')
      .find('li > a')
      .contains('Log out')
      .click();
    cy.url().should('include', '/login/');
  });
});
