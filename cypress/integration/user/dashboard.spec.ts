describe('User dashboard functionalities', function () {
  beforeEach(() => {
    cy.mockUser('admin')
      .intercept('GET', '/api/events-stats/?scope=*', {
        fixture: 'dashboard/events-stats.json',
      })
      .intercept('GET', '/api/marketplace-categories/?has_offerings=true', {
        fixture: 'offerings/offeringCategories.json',
      })
      .intercept('POST', '/api/support-issues/', {})
      .as('reportIssue')
      .intercept('GET', '/api/events/**&message=*', {
        fixture: 'dashboard/events-search.json',
      })
      .fixture('dashboard/events.json')
      .then((data) => {
        cy.intercept('GET', '/api/events/?page=1**', {
          headers: { 'x-result-count': '20', matched: 'first' },
          body: data.splice(0, 10),
        }).as('page1');
        cy.intercept('GET', '/api/events/?page=2**', {
          headers: { 'x-result-count': '20', matched: 'second' },
          body: data.splice(0, 10),
        }).as('page2');
      })
      .setToken()
      .visit('/profile/')
      .get('.loading-title')
      .should('not.exist')
      .waitForSpinner();
  });

  it('Should render title', () => {
    cy.fixture('users/admin.json').then((user) => {
      const userName = user.full_name;
      cy.get('h2')
        .contains('Welcome, ' + userName)
        .should('exist', { matchCase: false });
    });
  });

  it('Should render user event count and graph', () => {
    cy.get('p')
      .contains('User events this month', { matchCase: false })
      .should('exist')
      .siblings()
      .find('div > canvas')
      .should('be.visible');
  });

  it('Should report a security incident', () => {
    // Ensure content has loaded
    cy.get('h2').waitForSpinner();

    // Report an incident
    cy.get('button');
    // Open modal
    cy.contains('security incident')
      .click()
      .get('.modal-title')
      .contains('Report security incident')
      .waitForSpinner();

    // Insert date
    cy.get('input[placeholder="YYYY-MM-DD"]')
      .type('2022-04-05')

      // Change request type
      .get('[class$="control"]')
      .contains('incident type')
      .click()
      .selectTheFirstOptionOfDropdown();

    // Enter request title
    cy.get('input[name="summary"]').type('Suspicious emails');

    // Enter request description
    cy.get('textarea[name="description"]').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );

    // Submit form
    cy.get('button[type="submit"]')
      .contains('Report')
      .click()
      .get('p[class$="notification-message"]')
      .should('contain', 'Security incident has been successfully reported.');
  });

  it('Should not report security issue without type of incident', () => {
    // Ensure content has loaded
    cy.get('h2').waitForSpinner();

    // Report an incident
    cy.get('button');
    // Open modal
    cy.contains('security incident')
      .click()
      .get('.modal-title')
      .contains('Report security incident')
      .waitForSpinner();

    // Insert date
    cy.get('input[placeholder="YYYY-MM-DD"]').type('2022-04-05');

    // NOT choose request type
    cy.get('[class$="control"]').contains('incident type').click().click();

    // Enter request title
    cy.get('input[name="summary"]').type('Suspicious emails');

    // Ensure that button is disabled as form is empty
    cy.get('button.btn-primary').should('be.disabled');
  });

  it('Should open Marketplace category', () => {
    cy.get('h5').contains('Marketplace').should('exist');
    cy.get('.category-card')
      .contains('Chromatography')
      .click()
      .get('.modal-title')
      .get('.form-group')
      .contains('Project')
      .click()
      .get('[class$="control"]')
      .contains('Select project')
      .click()
      .type('demo{enter}')
      .get('.btn-primary')
      .contains('Continue')
      .click();
    cy.url()
      .should('include', '/projects/')
      .and('include', '/marketplace-category/');
  });

  it('Should open Organization dashboard', () => {
    cy.get('h5')
      .contains('Owned organizations')
      .should('exist')
      .waitForSpinner();
    cy.fixture('users/admin.json').then((user) => {
      const organizationName = user.customer_permissions[0].customer_name;
      cy.get('.dataTable').contains(organizationName).click();
    });
    cy.url().should('include', '/organizations/').and('include', '/dashboard/');
  });

  it('Should open Project dashboard', () => {
    cy.get('h5').contains('Managed projects').should('exist').waitForSpinner();
    cy.fixture('users/admin.json').then((user) => {
      const projectName = user.project_permissions[0].project_name;
      cy.get('.dataTable').contains(projectName).click();
    });
    cy.url().should('include', '/projects/');
  });

  it('Should export Projects as an Excel file', () => {
    cy.get('h5')
      .contains('Managed projects')
      .parent()
      .parent()
      .find('.btn-group > .dropdown')
      .contains('Export as')
      .click()
      .get('.open > .dropdown-menu > li > a')
      .contains('Excel')
      .click();
  });

  it('Should open Event types modal', () => {
    cy.get('.table-buttons').contains('Event types').click();
    cy.get('.modal-title').contains('Event types').should('exist');
    cy.get('button').contains('Cancel').click();
  });

  it('Should expand Audit Log item and read details', () => {
    cy.get('h5').contains('Audit logs').should('exist').waitForSpinner();
    cy.fixture('dashboard/events.json').then((events) => {
      const message = events[0].message;
      const eventType = events[0].event_type;
      const userName = events[0].context.user_full_name;
      const ip = events[0].context.ip_address;
      cy.get('.dataTable').contains(message).prev().click();
      cy.get('.event-details-table')
        .should('contain', userName)
        .and('contain', ip)
        .and('contain', eventType);
    });
  });

  it('Should export Audit Logs as PDF', () => {
    cy.get('h5')
      .contains('Audit logs')
      .parent()
      .parent()
      .find('.btn-group > .dropdown')
      .contains('Export as')
      .click()
      .get('.open > .dropdown-menu > li > a')
      .contains('PDF')
      .click();
  });

  it('Should navigate Audit Logs via pagination', () => {
    cy.fixture('dashboard/events.json').then((events) => {
      const message = events[16].message;
      cy.wait('@page1')
        .its('response.statusCode')
        .should('eq', 200)
        .get('.pagination')
        .contains('2')
        .click()
        .wait('@page2')
        .its('response.statusCode')
        .should('eq', 200);
      cy.get('tbody').should('contain', message);
    });
  });

  it('Should display Audit Logs search results', () => {
    cy.get('.form-control')
      .type('has been created for user{enter}')
      .parent()
      .parent()
      .siblings('.table-container')
      .find('table > tbody > tr')
      .should('have.length', '2');
  });
});
