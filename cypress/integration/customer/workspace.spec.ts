describe('Organisation workspace', () => {
  beforeEach(() => {
    cy.mockUser('admin')
      .mockCustomer()
      .intercept('GET', '/api/daily-quotas/**', {
        fixture: 'customers/user_count.json',
      })
      .setToken()
      .visit('/organizations/bf6d515c9e6e445f9c339021b30fc96b/dashboard/')
      .waitForSpinner()
      .get('h2')
      .should('exist')
      .waitForSpinner();
  });

  it('Should go to Marketplace page', () => {
    cy.get('a').contains('Marketplace').click();
    cy.get('h1').contains('Marketplace').should('exist', { matchCase: false });
  });

  it('Should go to Projects page', () => {
    cy.get('a').contains('Projects').click();
    cy.url().should('include', '/organizations/').and('include', '/projects/');
  });

  it('Should go to My offerings page', () => {
    cy.get('a').contains('My services').click();
    cy.get('a').contains('My offerings').click();
    cy.get('h2').contains('My offerings').should('exist', { matchCase: false });
  });

  it('Should go to My orders page', () => {
    cy.get('a').contains('My services').click();
    cy.get('a').contains('My orders').click();
    cy.get('h2').contains('My orders').should('exist', { matchCase: false });
  });

  it('Should go to My resources page', () => {
    cy.get('a').contains('My services').click();
    cy.get('a').contains('My resources').click();
    cy.get('h2').contains('My resources').should('exist', { matchCase: false });
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

  it('Should go to Billing page', () => {
    cy.get('a').contains('Accounting').click();
    cy.url().should('include', '/organizations/').and('include', '/billing/');
  });

  it('Should go to Manage organisation page', () => {
    cy.get('a').contains('Manage').click();
    cy.get('.settings-title')
      .contains('Organization details')
      .should('exist', { matchCase: false });
  });

  it('Should go back to Dashboard page', () => {
    cy.get('a').contains('Audit logs').click();
    cy.get('a').contains('Dashboard').click();
    cy.title().should('contain', 'Dashboard');
  });

  it('Should validate navigation to profile pages via dropdown', () => {
    cy.get('.nav-header > .dropdown >.dropdown-toggle')
      .click()
      .get('.dropdown-menu')
      .find('li > a')
      .contains('Audit logs')
      .click();
    cy.title().should('contain', 'Audit logs');
  });
});
