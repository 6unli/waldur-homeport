describe('Private cloud detail view – Security', () => {
  beforeEach(() => {
    cy.mockUser('admin')
      .setToken()
      .log('Visit Project Resources – Private cloud')
      .intercept('GET', '/api/customers/*', {
        fixture: 'customers/andersen.json',
      })
      .intercept('GET', '/api/marketplace-categories/?field=*', {
        fixture: 'marketplace/category-offerings.json',
      })
      .intercept('GET', '/api/projects/**/counters/**', {
        fixture: 'marketplace/project-counters.json',
      })
      .intercept('GET', '/api/projects/**', {
        fixture: 'projects/project-2.json',
      })
      .intercept('GET', '/api/openstack-tenants/*', {
        fixture: 'openstack/tenant.json',
      })
      .intercept('GET', '/api/openstack-security-groups/?page=**', {
        fixture: 'openstack/security-groups.json',
      })
      .intercept('GET', '/api/marketplace-offerings/*', {
        fixture: 'marketplace/offerings-security.json',
      })
      .intercept('GET', '/api/marketplace-orders/*', [])
      .intercept('GET', '/api/marketplace-cart-items/', [])
      .visit(
        'projects/6628f38de458475baad6aa146f2ab406/resources/OpenStack.Tenant/de4e00c2e31d47ba98f4787c4df1a9d3/security_groups',
      )
      .waitForSpinner();
  });

  it('Should render title and overview', () => {
    cy.fixture('openstack/tenant.json').then((tenant) => {
      const name = tenant.name;
      const desc = tenant.description;
      cy.get('h2').contains(name).should('exist');
      cy.get('h2').contains('OpenStack Tenant').should('exist');
      cy.get('.resource-details-table').contains(desc).should('exist');
    });
  });

  it('Should open offering details modal and render the content and tabs', () => {
    cy.intercept('GET', '/api/marketplace-offerings/*', {
      fixture: 'marketplace/offerings-security.json',
    }).intercept('GET', '/api/marketplace-categories/*', {
      fixture: 'marketplace/categories-clouds.json',
    });
    cy.get('.btn-group > .btn').contains('Offering details').click();
    cy.fixture('marketplace/offerings-security.json').then((offering) => {
      const name = offering.name;
      const desc = offering.full_description;
      const tos = offering.terms_of_service;
      const shot = offering.screenshots[0].name;
      const mail = offering.attributes.vpc_Support_email;
      cy.get('.modal-body').waitForSpinner();
      cy.get('h3').contains(name).should('exist');
      cy.get('div').contains(desc).should('exist');
      cy.get('#offering-tabs-tab-tab-1').click();
      cy.get('div').contains(tos).should('exist');
      cy.get('#offering-tabs-tab-tab-2').click();
      cy.get('h4').contains(shot).should('exist');
      cy.get('#offering-tabs-tab-tab-3').click();
      cy.get('.tab-content').contains(mail).should('exist');
      cy.get('#offering-tabs-tab-tab-4').click();
      cy.get('.tab-content').contains('ISKE M').should('exist');
      cy.get('#offering-tabs-tab-tab-5').click();
      cy.get('.tab-content').contains('VMware').should('exist');
      cy.get('#offering-tabs-tab-tab-6').click();
      cy.get('.tab-content').contains('Nginx').should('exist');
    });
    cy.get('.modal-footer > .btn').contains('Cancel').click();
  });

  it('Should open plan details modal and render the content', () => {
    cy.intercept('GET', '/api/marketplace-resources/*', {
      fixture: 'marketplace/resources-clouds.json',
    });
    cy.get('.btn-group > .btn').contains('Plan details').click();
    cy.fixture('marketplace/offerings-security.json').then((offer) => {
      const name = offer.plans[0].name;
      cy.get('.modal-body').contains(name).should('exist');
    });
  });

  it('Should open each tab', () => {
    for (let i = 1; i < 11; i++) {
      cy.get('ul[role="tablist"] > :nth-child(' + i + ') > a').click({
        force: true,
      });
      cy.get('.tab-pane.active').should('exist');
    }
  });

  it('Should create security group', () => {
    cy.intercept(
      'POST',
      '/api/openstack-tenants/*/create_security_group/',
      {},
    ).as('create');
    cy.get('.table-buttons > .btn-group').contains('Create').click();
    cy.get(':nth-child(1) > .form-control').type('allow-all');
    cy.get(':nth-child(2) > .form-control').type(
      'Security group for any access',
    );
    cy.get('.modal-body > .btn-primary').contains('Add').click();
    cy.get('.modal-footer > .btn-primary').contains('Submit').click();
    cy.wait('@create').its('response.statusCode').should('eq', 200);
  });

  it('Should synchronise group', () => {
    cy.intercept(
      'POST',
      '/api/openstack-tenants/*/pull_security_groups/',
      {},
    ).as('pull');
    cy.get('.table-buttons > .btn-group').contains('Sync').click();
    cy.wait('@pull').its('response.statusCode').should('eq', 200);
  });

  it('Should open security group details modal and render content', () => {
    cy.intercept('GET', '/api/openstack-security-groups/**', {
      fixture: 'openstack/security-group-default.json',
    });
    cy.get(':nth-child(1)')
      .contains('.btn', 'Details')
      .click()
      .waitForSpinner();
    cy.fixture('openstack/security-group-default.json').then((group) => {
      const uuid = group.uuid;
      cy.get('.modal-body').contains(uuid).should('exist');
    });
  });

  it('Should open security group details view', () => {
    cy.intercept('GET', '/api/openstack-security-groups/**', {
      fixture: 'openstack/security-group-default.json',
    });
    cy.fixture('openstack/security-groups.json').then((groups) => {
      const name = groups[0].name;
      cy.get('.table').contains('a', name).click();
    });
    cy.url()
      .should('include', '/OpenStack.SecurityGroup/')
      .and('include', '/security_groups');
  });
});
