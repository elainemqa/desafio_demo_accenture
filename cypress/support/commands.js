
Cypress.Commands.add('apiCreateUser', (userName, password) => {
  return cy.request({
    method: 'POST',
    url: '/Account/v1/User',
    body: { userName, password },
  });
});

Cypress.Commands.add('apiGenerateToken', (userName, password) => {
  return cy.request({
    method: 'POST',
    url: '/Account/v1/GenerateToken',
    body: { userName, password },
  });
});

Cypress.Commands.add('apiDeleteUser', (userId, token) => {
  return cy.request({
    method: 'DELETE',
    url: `/Account/v1/User/${userId}`,
    headers: { Authorization: `Bearer ${token}` },
    failOnStatusCode: false,
  });
});
