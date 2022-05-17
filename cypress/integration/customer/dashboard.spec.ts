describe('Organisation dashboard', () => {
  beforeEach(() => {
    cy.mockUser('admin')
      .mockCustomer()
      .intercept('OPTIONS', '/api/customers/**', {
        fixture: 'customers/countries.json',
      })
      .intercept('POST', '/api/customers/**', {
        fixture: 'customers/alice.json',
      })
      .intercept('GET', '/api/marketplace-orders/**', [])
      .intercept('GET', '/api/daily-quotas/**', {
        fixture: 'customers/user_count.json',
      })
      .intercept('GET', '/api/projects/**', {
        fixture: 'customers/projects.json',
      })
      .intercept('GET', '/api/marketplace-category-component-usages/**', [])
      .intercept('GET', '/api/marketplace-resources/?page=**', {
        fixture: 'marketplace/resources.json',
      })
      .intercept('GET', '/api/marketplace-resources/?project_uuid=**', {
        fixture: 'marketplace/resources.json',
      })
      .intercept('GET', '/api/marketplace-resources/**', {
        fixture: 'marketplace/resources-dashboard.json',
      })
      .intercept('GET', '/api/marketplace-categories/**', {
        fixture: 'marketplace/category-offerings.json',
      })
      .intercept('GET', '/api/marketplace-offerings/**', {
        fixture: 'marketplace/offerings-dashboard.json',
      })
      .setToken()
      .visit('/organizations/bf6d515c9e6e445f9c339021b30fc96b/dashboard/')
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

  it('Should render monthly cost count and graph', () => {
    cy.get('h2').waitForSpinner(); // Ensure content has loaded
    cy.get('p')
      .contains('Estimated monthly cost', { matchCase: false })
      .should('exist')
      .siblings()
      .find('div > canvas')
      .should('be.visible');
  });

  it('Should render team size count and graph', () => {
    cy.get('h2').waitForSpinner(); // Ensure content has loaded
    cy.get('p')
      .contains('Team size', { matchCase: false })
      .should('exist')
      .siblings()
      .find('div > canvas')
      .should('be.visible');
  });

  it('Should add project', () => {
    cy.intercept('GET', '/api/project-types/**', []);
    cy.intercept('POST', '/api/projects/', {}).as('project');
    cy.get('h2').waitForSpinner(); // Ensure content has loaded
    cy.get('button').contains('Add project').click();
    cy.get('input[name="name"]').type('Newest project');
    cy.get('textarea[name="description"]').type('Work shall be done');
    cy.get('button[type="submit"]').click();
    cy.wait('@project').its('response.statusCode').should('eq', 200);
  });

  it('Should render invitation modal', () => {
    cy.get('h2').waitForSpinner(); // Ensure content has loaded
    cy.get('button').contains('Invite').click();
    cy.get('.modal-header > h4').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="role"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
    cy.get('button[type="button"]').contains('Cancel').click();
  });

  it('Should report an issue', () => {
    cy.intercept('POST', '/api/support-issues/').as('reportIssue');
    cy.get('h2').waitForSpinner(); // Ensure content has loaded
    cy.get('button').contains('Report an issue').click();
    cy.waitForSpinner();
    cy.get('.modal-header > h4').should('exist');
    // Change request type
    cy.get('[class$="control"]')
      .contains('Change Request')
      .click()
      .selectTheFirstOptionOfDropdown();

    // Enter request title
    cy.get('input[name="summary"]').type('Long page load time');

    // Enter request description
    cy.get('textarea[name="description"]').type('Lorem ipsum dolor sit amet.');

    // Enter project
    cy.get(
      '.modal-body > .form-group > [class$="container"] > [class$="control"]',
    )
      .contains('Select project')
      .click()
      .selectTheFirstOptionOfDropdown();

    // Enter resource
    cy.get('[class$="control"]')
      .contains('Select affected resource')
      .click()
      .selectTheFirstOptionOfDropdown();

    // Uncomment after Cypress 9.3 update
    // cy.get('input[type=file]').selectFile(['customers/user_count.json']);

    // Submit form
    cy.get('button[type="submit"]')
      .click()
      .wait('@reportIssue')
      .its('response.statusCode')
      .should('eq', 200);
  });

  it('Should expand the resource and render details', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(1)').click();
    cy.fixture('marketplace/resources.json').then((details) => {
      const uuid = details[0].uuid;
      cy.get('div').contains('UUID').parent().should('contain', uuid);
    });
  });

  it('Should open plan details modal and render its contents', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(1)').click();
    cy.get('dt').contains('Plan details').siblings().find('a').click();
    cy.get('.modal-title').contains('Plan details').should('exist');
    cy.fixture('marketplace/offerings-dashboard.json').then((offering) => {
      const name = offering.components[0].name;
      cy.get('.modal-body').should('contain', name);
    });
  });

  it('Should open attributes modal and render its contents', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(1)').click();
    cy.get('dt').contains('Attributes').siblings().find('a').click();
    cy.get('.modal-title').contains('Request details').should('exist');
    cy.fixture('marketplace/resources.json').then((resource) => {
      const name = resource[0].attributes.name;
      cy.get('.modal-body').should('contain', name);
    });
  });

  it('Should open resource category page', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(4) > a').click();
    cy.url()
      .should('include', '/projects/')
      .and('include', '/marketplace-resources/');
  });

  it('Should open resource item detail page', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(2) > a').click();
    cy.url()
      .should('include', '/organizations/')
      .and('include', '/marketplace-service-provider-public-resource-details/');
  });
});
