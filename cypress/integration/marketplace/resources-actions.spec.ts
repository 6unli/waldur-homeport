describe('Marketplace category – VMs – Actions', () => {
  beforeEach(() => {
    cy.mockUser(`admin`)
      .setToken()
      .log('Visit Marketplace VMs category')
      .intercept('GET', '/api/customers/**', {
        fixture: 'customers/allen.json',
      })
      .intercept('GET', '/api/marketplace-categories/?field=*', {
        fixture: 'marketplace/category-offerings.json',
      })
      .intercept('GET', '/api/marketplace-resources/?page=*', {
        fixture: 'marketplace/resources-vms.json',
      })
      .intercept('GET', '/api/marketplace-categories/**', {
        fixture: 'marketplace/categories-vm.json',
      })
      .intercept('GET', '/api/projects/?name=**', {
        fixture: 'dashboard/projects.json',
      })
      .intercept('GET', '/api/projects/**/counters/**', {
        fixture: 'marketplace/project-counters.json',
      })
      .intercept('GET', '/api/projects/**', {
        fixture: 'projects/project-1.json',
      })
      .intercept('GET', '/api/openstacktenant-instances/*', {
        fixture: 'openstack/openstacktenant-instances-vm.json',
      })
      .intercept('GET', '/api/marketplace-orders/*', [])
      .intercept('GET', '/api/marketplace-cart-items/**', [])
      .visit(
        '/projects/7473e687c7544560925cb88be9f42a89/marketplace-resources/e5a5e7651f394d10958328bbc3e967eb/',
      )
      .waitForSpinner();
  });

  it('Should edit resource', () => {
    cy.intercept('PUT', '/api/openstacktenant-instances/**', {}).as(
      'editInstance',
    );
    cy.get('h2').contains('VMs resources'); // To wait for content to load
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu').contains('Edit').click({ force: true });
    cy.get(':nth-child(1) > div > .form-control').clear();
    cy.get(':nth-child(1) > div > .form-control').type('New name');
    cy.get('.modal-footer > div > .btn-primary').click();
    cy.wait('@editInstance')
      .its('request.body')
      .should('deep.equal', { name: 'New name', description: '' });
  });

  it('Should move resource', () => {
    cy.intercept('POST', '/api/marketplace-resources/*/move_resource/', {}).as(
      'moveInstance',
    );
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu').contains('Move').click({ force: true });
    cy.get('.form-group > [class$="container"]')
      .contains('Select project')
      .click();
    cy.get('#react-select-3-option-0').click();
    cy.get('.modal-footer > .btn-primary').click();
    cy.wait('@moveInstance')
      .its('request.body')
      .should('deep.equal', {
        project: { url: '/api/project-permissions/1044/' },
      });
  });

  it('Should synchronise resource', () => {
    cy.intercept('POST', '/api/openstacktenant-instances/*/pull/', {}).as(
      'pull',
    );
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu').contains('Sync').click({ force: true });
    cy.wait('@pull').its('response.statusCode').should('eq', 200);
  });

  it('Should stop resource', () => {
    cy.intercept('POST', '/api/openstacktenant-instances/*/stop/', {}).as(
      'stop',
    );
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu').contains('Stop').click({ force: true });
    cy.wait('@stop').its('response.statusCode').should('eq', 200);
  });

  it('Should restart resource', () => {
    cy.intercept('POST', '/api/openstacktenant-instances/*/restart/', {}).as(
      'restart',
    );
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu').contains('Restart').click({ force: true });
    cy.wait('@restart').its('response.statusCode').should('eq', 200);
  });

  it('Should update resource security groups', () => {
    cy.intercept(
      'POST',
      '/api/openstacktenant-instances/*/update_security_groups/',
      {},
    ).as('updateSecurity');
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu')
      .contains('Update security groups')
      .click({ force: true });
    cy.get(':nth-child(1)').contains('ssh').siblings().click();
    cy.get('.modal-footer > .btn-primary').click();
    cy.wait('@updateSecurity').its('response.statusCode').should('eq', 200);
  });

  it('Should update resource floating IPs', () => {
    cy.intercept(
      'POST',
      '/api/openstacktenant-instances/*/update_floating_ips/',
      {},
    ).as('updateIps');
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu')
      .contains('Update floating IPs')
      .click({ force: true });
    cy.get('button[title="Delete"]').click();
    cy.get('.modal-body > .btn').contains('Add').click();
    cy.fixture('openstack/openstacktenant-instances-vm.json').then((vm) => {
      const subnet = vm.internal_ips_set[0].subnet;
      cy.get(':nth-child(1) > .col-md-6 > .form-control').select(subnet);
    });
    cy.get('.modal-footer > .btn-primary').click();
    cy.wait('@updateIps').its('response.statusCode').should('eq', 200);
  });

  it('Should destroy resource', () => {
    cy.intercept('POST', '/api/marketplace-resources/*/terminate/', {}).as(
      'terminate',
    );
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu').contains('Force destroy').click({ force: true });
    cy.get('.btn-primary').contains('Submit').click();
    cy.wait('@terminate').its('response.statusCode').should('eq', 200);
  });

  it('Should unlink resource', () => {
    cy.intercept('POST', '/api/openstacktenant-instances/*/unlink/', {}).as(
      'unlink',
    );
    cy.get(':nth-child(1) > :nth-child(8) > .dropdown')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu').contains('Unlink').click({ force: true });
    cy.get('.btn-danger').contains('Yes').click();
    cy.wait('@unlink').its('response.statusCode').should('eq', 200);
  });
});
