describe('Marketplace category page functionalities', () => {
  beforeEach(() => {
    cy.mockUser(`admin`)
      .mockChecklists()
      .setToken()
      .log('Visit Marketplace VMs category')
      .intercept('GET', '/api/customers/', {
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
      .intercept('GET', '/api/projects/**/counters/**', {
        fixture: 'marketplace/project-counters.json',
      })
      .intercept('GET', '/api/projects/**', {
        fixture: 'projects/project-1.json',
      })
      .intercept('GET', '/api/marketplace-resource-offerings/**', {
        fixture: 'marketplace/resource-offerings.json',
      })
      .intercept('GET', '/api/marketplace-orders/*', [])
      .intercept('GET', '/api/marketplace-cart-items/', [])
      .visit(
        '/projects/7473e687c7544560925cb88be9f42a89/marketplace-resources/e5a5e7651f394d10958328bbc3e967eb/',
      )
      .waitForSpinner();
  });

  it('Should render title and resource list', () => {
    cy.get('h2')
      .contains('VMs resources')
      .should('exist', { matchCase: false })
      .get('table tbody tr')
      .should('have.length', 2);
  });

  it('Should expand the resource and render details', () => {
    cy.intercept('GET', '/api/marketplace-resources/*/details/', {
      fixture: 'marketplace/resource-details.json',
    });
    cy.get('tbody > :nth-child(1) > :nth-child(1)').click();
    cy.fixture('marketplace/resource-details.json').then((details) => {
      const uuid = details.uuid;
      cy.get('div').contains('UUID').parent().should('contain', uuid);
    });
  });

  it('Should import resource', () => {
    cy.intercept('GET', '/api/marketplace-offerings/*/importable_resources/', {
      fixture: 'marketplace/resources.json',
    }).intercept('GET', '/api/marketplace-offerings/**', {
      fixture: 'marketplace/offerings.json',
    });
    cy.get('.table-buttons > .btn-group').contains('Import resource').click();
    cy.get('.modal-title')
      .waitForSpinner()
      .get(':nth-child(3) > .btn')
      .contains('Select')
      .click();
    cy.get(
      ':nth-child(1) > :nth-child(4) > [class$="container"] > [class$="control"]',
    )
      .contains('Select plan')
      .click();
    cy.get('#react-select-3-option-0').click();
    cy.get('tbody > :nth-child(1) > :nth-child(3) > .btn').click();
    cy.get('.modal-footer > .btn-primary').click();
    cy.get("[data-testid='notification']").should(
      'contain',
      'All resources have been imported.',
    );
  });

  it('Should go to marketplace offerings (vm)', () => {
    cy.get('.table-buttons > .btn-group').contains('Add resource').click();
    cy.fixture('marketplace/categories-vm.json').then((vm) => {
      const uuid = vm.uuid;
      cy.url().should('contain', '/marketplace-category/' + uuid);
    });
  });

  it('Should open resource item page', () => {
    cy.intercept('GET', '/api/openstacktenant-instances/*', {
      fixture: 'openstack/openstacktenant-instances-vm.json',
    });
    cy.get('tbody > :nth-child(1) > :nth-child(2) > a').click();
    cy.url().should('contain', '/OpenStackTenant.Instance/');
  });
});
