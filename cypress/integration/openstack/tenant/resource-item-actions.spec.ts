describe('Private cloud detail view – Actions', () => {
  beforeEach(() => {
    cy.mockUser('admin')
      .mockChecklists()
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
      .intercept('GET', '/api/projects/?customer=**', {
        fixture: 'projects/andersen.json',
      })
      .intercept('GET', '/api/projects/*', {
        fixture: 'projects/project-2.json',
      })
      .intercept('GET', '/api/openstack-tenants/*', {
        fixture: 'openstack/tenant.json',
      })
      .as('tenant')
      .intercept('GET', '/api/openstack-security-groups/?page=**', {
        fixture: 'openstack/security-groups.json',
      })
      .as('groups')
      .intercept('GET', '/api/marketplace-orders/*', [])
      .intercept('GET', '/api/marketplace-cart-items/**', [])
      .visit(
        'projects/6628f38de458475baad6aa146f2ab406/resources/OpenStack.Tenant/de4e00c2e31d47ba98f4787c4df1a9d3/security_groups',
      )
      .waitForSpinner();
  });

  it('Should edit resource item', () => {
    cy.intercept('PUT', '/api/openstack-tenants/**', {}).as('edit');
    cy.wait('@groups').its('response.statusCode').should('eq', 200);
    cy.get('.pull-right > .dropdown > #actions-dropdown-btn')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.pull-right > .dropdown > .dropdown-menu')
      .contains('a', 'Edit')
      .click({ force: true });
    cy.get(':nth-child(2) > div > .form-control').clear();
    cy.get(':nth-child(2) > div > .form-control').type(
      'Create customised experiences',
    );
    cy.get('.modal-footer > div > .btn-primary').click();
    cy.wait('@edit').its('response.statusCode').should('eq', 200);
  });

  it('Should request direct access to resource item', () => {
    cy.intercept('GET', '/api/marketplace-resources/?project_uuid=*', {
      fixture: 'marketplace/project-offerings.json',
    })
      .intercept('POST', '/api/support-issues/', {})
      .as('support');
    cy.get('.pull-right > .dropdown > #actions-dropdown-btn')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.pull-right > .dropdown > .dropdown-menu')
      .contains('a', 'Request direct access')
      .click({ force: true });
    cy.get("textarea[name='description']").type('Need it for the campus');
    cy.get('.form-group > .control-label')
      .contains('Project')
      .siblings()
      .click();
    cy.get('#react-select-2-option-2').click();
    cy.get('.form-group > .control-label')
      .contains('Affected resource')
      .siblings()
      .click();
    cy.get('#react-select-4-option-4').click();
    cy.get('.modal-footer > .btn-primary').contains('Create').click();
    cy.wait('@support').its('response.statusCode').should('eq', 200);
  });

  it('Should synchronise resource item', () => {
    cy.intercept('POST', '/api/openstack-tenants/*/pull/', {}).as('pull');
    cy.get('.pull-right > .dropdown > #actions-dropdown-btn')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.dropdown-menu').contains('Sync').click({ force: true });
    cy.wait('@pull').its('response.statusCode').should('eq', 200);
  });

  it('Should change resource item plan', () => {
    cy.intercept('POST', '/api/marketplace-resources/*/switch_plan/', {})
      .as('switch')
      .intercept('GET', '/api/marketplace-offerings/*', {
        fixture: 'marketplace/offerings-security.json',
      });
    cy.get('.pull-right > .dropdown > #actions-dropdown-btn')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.pull-right > .dropdown > .dropdown-menu')
      .contains('a', 'Change plan')
      .click({ force: true });
    cy.get(
      '.table-responsive > .table > tbody > :nth-child(2) > :nth-child(1)',
    ).click();
    cy.get('.modal-footer > .btn-primary').contains('Submit').click();
    cy.wait('@switch').its('response.statusCode').should('eq', 200);
  });

  it('Should change resource item limits', () => {
    cy.intercept('GET', '/api/marketplace-resources/*', {
      fixture: 'marketplace/resource-limits.json',
    })
      .intercept('GET', '/api/marketplace-plans/**', {
        fixture: 'marketplace/plans.json',
      })
      .intercept('GET', '/api/marketplace-offerings/*', {
        fixture: 'marketplace/offerings-cloud.json',
      });
    cy.get('.pull-right > .dropdown > #actions-dropdown-btn')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.pull-right > .dropdown > .dropdown-menu')
      .contains('a', 'Change limits')
      .click({ force: true });
    cy.get(':nth-child(1) > .form-group > .input-group > .form-control')
      .clear()
      .type('03{backspace}');
    cy.get(':nth-child(2) > .form-group > .input-group > .form-control')
      .clear()
      .type('05{backspace}');
    cy.get(':nth-child(3) > .form-group > .input-group > .form-control')
      .clear()
      .type('50{backspace}');
    cy.get('.modal-footer > .btn-primary').contains('Submit').click();
  });

  it('Should terminate resource item', () => {
    cy.intercept('POST', '/api/marketplace-resources/*/terminate/', {}).as(
      'terminate',
    );
    cy.get('.pull-right > .dropdown > #actions-dropdown-btn')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.pull-right > .dropdown > .dropdown-menu')
      .contains('a', 'Terminate')
      .click({ force: true });
    cy.get('.btn-danger').contains('Submit').click();
    cy.wait('@terminate').its('response.statusCode').should('eq', 200);
  });

  it('Should unlink resource item', () => {
    cy.intercept('POST', '/api/openstack-tenants/*/unlink/', {}).as('unlink');
    cy.get('.pull-right > .dropdown > #actions-dropdown-btn')
      .contains('Actions')
      .click({ force: true })
      .waitForDropdown();
    cy.get('.pull-right > .dropdown > .dropdown-menu')
      .contains('a', 'Unlink')
      .click({ force: true });
    cy.get('.btn-danger').contains('Yes').click();
    cy.wait('@unlink').its('response.statusCode').should('eq', 200);
  });
});
