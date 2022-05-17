describe('Private cloud detail view – Security Group Actions', () => {
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
      .intercept('GET', '/api/openstack-security-groups/**', {
        fixture: 'openstack/security-group-default.json',
      })
      .intercept('GET', '/api/marketplace-orders/*', [])
      .intercept('GET', '/api/marketplace-cart-items/**', [])
      .visit(
        'projects/6628f38de458475baad6aa146f2ab406/resources/OpenStack.Tenant/de4e00c2e31d47ba98f4787c4df1a9d3/security_groups',
      )
      .waitForSpinner();
  });

  it('Should edit security group', () => {
    cy.intercept('PUT', '/api/openstack-security-groups/*', {}).as('edit');
    cy.get('tbody > tr > td > .btn-group')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('tbody > tr > td > .btn-group')
      .contains('a', 'Edit')
      .click({ force: true });
    cy.get('.modal-body').waitForSpinner();
    cy.get(':nth-child(1) > div > .form-control').clear().type('deny-all');
    cy.get(':nth-child(2) > div > .form-control')
      .clear()
      .type('Allows nothing');
    cy.get('.btn-primary').contains('Submit').click();
    cy.wait('@edit').its('response.statusCode').should('eq', 200);
  });

  it('Should set rules to security group', () => {
    cy.intercept('POST', '/api/openstack-security-groups/*/set_rules/', {}).as(
      'set',
    );
    cy.get('tbody > tr > td > .btn-group')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('tbody > tr > td > .btn-group')
      .contains('a', 'Set rules')
      .click({ force: true });
    cy.get('.modal-body > .btn-primary').contains('Add').click();
    cy.get(':nth-child(5) > :nth-child(1) > .form-control').select('IPv6');
    cy.get(':nth-child(5) > :nth-child(2) > .form-control').select('egress');
    cy.get(':nth-child(5) > :nth-child(3) > .form-control').select('tcp');
    cy.get(':nth-child(5) > :nth-child(7) > .form-control').type('description');
    cy.get(':nth-child(3) > :nth-child(8) > .btn-danger').click();
    cy.get('.btn-primary').contains('Submit').click();
    cy.wait('@set').its('response.statusCode').should('eq', 200);
  });

  it('Should destroy security group', () => {
    cy.intercept('DELETE', '/api/openstack-security-groups/*', {}).as(
      'destroy',
    );
    cy.get('tbody > tr > td > .btn-group')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('tbody > tr > td > .btn-group')
      .contains('a', 'Destroy')
      .click({ force: true });
    cy.get('.btn-danger').contains('Yes').click();
    cy.wait('@destroy').its('response.statusCode').should('eq', 200);
  });

  it('Should synchronise security group', () => {
    cy.intercept('POST', '/api/openstack-security-groups/*/pull/', {}).as(
      'pull',
    );
    cy.get('tbody > tr > td > .btn-group')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('tbody > tr > td > .btn-group')
      .contains('a', 'Sync')
      .click({ force: true });
    cy.wait('@pull').its('response.statusCode').should('eq', 200);
  });

  it('Should unlink security group', () => {
    cy.intercept('POST', '/api/openstack-security-groups/*/unlink/', {}).as(
      'unlink',
    );
    cy.get('tbody > tr > td > .btn-group')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('tbody > tr > td > .btn-group')
      .contains('a', 'Unlink')
      .click({ force: true });
    cy.get('.btn-danger').contains('Yes').click();
    cy.wait('@unlink').its('response.statusCode').should('eq', 200);
  });
});
