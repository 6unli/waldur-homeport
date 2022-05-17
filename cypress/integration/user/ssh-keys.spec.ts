describe('SSH Keys functionalities', () => {
  const successKeyCreated = 'The key has been created.';
  const successKeyRemoved = 'SSH key has been removed.';
  const successKeyCopied = 'Text has been copied';
  const errorInvalidInput = 'Invalid SSH public key.';
  const errorKeyExist = 'Key with same fingerprint already exists.';

  beforeEach(() => {
    cy.mockUser()
      .mockChecklists()
      .setToken()
      .intercept(
        'GET',
        `/api/keys/?page=1&page_size=10&user_uuid=${Cypress.env('USER_UUID')}`,
        {
          fixture: 'dashboard/ssh-keys.json',
        },
      );
    cy.visit('/profile/keys/');
  });

  it('Should render title and key items', () => {
    cy.get('h2')
      .contains('SSH keys')
      .should('exist')
      .get('table tbody tr')
      .should('have.length', 3);
  });

  it('Should expand items and copy key to clipboard', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(1)')
      .click()
      .get(':nth-child(2) > td > :nth-child(1)')
      .should('contain', 'Public key')
      .get('.copy-to-clipboard-container > p > a')
      .click();
    cy.get("[data-testid='notification']").contains(successKeyCopied);
  });

  it('Should export list as csv', () => {
    cy.get('.btn-group > .dropdown')
      .contains('Export as')
      .click()
      .get('.dropdown-menu')
      .find('li > a')
      .contains('CSV')
      .click();
  });

  it('Should not submit null key input', () => {
    cy.intercept('POST', '/api/keys/').as('addKey');
    cy.contains('button', 'Add key').click();
    cy.get('input[name="name"]')
      .type('text key cy')
      .get('button[type="submit"]')
      .click();
    cy.get("[data-testid='notification']").should('not.exist');
  });

  it('Should display error messages for invalid key input', () => {
    cy.intercept('POST', '/api/keys/', {
      statusCode: 400,
      body: {
        public_key: [errorInvalidInput],
      },
    });
    cy.contains('button', 'Add key').click();
    cy.get('input[name="name"]')
      .type('text key cy')
      .get('textarea[name="public_key"]')
      .type('s0mePub1icK6y')
      .get('button[type="submit"]')
      .click();
    cy.get("[data-testid='notification']").contains(errorInvalidInput);
  });

  it('Should display error messages for existing key input', () => {
    cy.intercept('POST', '/api/keys/', {
      statusCode: 400,
      body: {
        public_key: [errorKeyExist],
      },
    });
    cy.contains('button', 'Add key').click();
    cy.fixture('dashboard/ssh-keys').then((keys) => {
      cy.get('input[name="name"]')
        .type('text key cy')
        .get('textarea[name="public_key"]')
        .type(keys[0].public_key)
        .get('button[type="submit"]')
        .click();
    });
    cy.get("[data-testid='notification']").contains(errorKeyExist);
  });

  it('Should add a SSH key with appropriate inputs', () => {
    cy.intercept('POST', '/api/keys/', {
      statusCode: 201,
      fixture: 'dashboard/ssh-key',
    });
    cy.contains('button', 'Add key').click();
    cy.fixture('dashboard/ssh-key').then((sshKey) => {
      cy.get('input[name="name"]')
        .type(sshKey.name)
        .get('textarea[name="public_key"]')
        .type(sshKey.public_key)
        .get('button[type="submit"]')
        .click();
      cy.get("[data-testid='notification']").contains(successKeyCreated);
    });
  });

  it('Should be able to delete a SSH key', () => {
    cy.fixture('dashboard/ssh-keys').then((keys) => {
      cy.intercept('DELETE', `/api/keys/${keys[0].uuid}/`, {});
      cy.get('.table-container tbody tr')
        .should('have.length', 3)
        .contains('tr', keys[0].name)
        .contains('button', 'Remove')
        .click();
      cy.get('.modal-footer').should('be.visible');
      cy.contains('.modal-footer button', 'Yes').click();
    });
    cy.get("[data-testid='notification']")
      .contains(successKeyRemoved)
      .get('table tbody tr')
      .should('have.length', 2);
  });
});
