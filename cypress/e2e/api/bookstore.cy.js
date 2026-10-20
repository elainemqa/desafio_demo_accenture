/// <reference types="cypress" />

describe(' Fluxo completo de usuário e livros', () => {
 
  const state = {
    userName: '',
    password: 'Teste@12345', 
    userId: '',
    token: '',
    books: [],
    chosenIsbns: [],
  };

  before(() => {
    state.userName = `qa_user_${Date.now()}`;
  });

  after(() => {
      if (state.userId && state.token) {
      cy.apiDeleteUser(state.userId, state.token);
    }
  });

  it('Criar um usuário', () => {
    cy.apiCreateUser(state.userName, state.password).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property('userID').and.not.be.empty;
      expect(res.body).to.have.property('username', state.userName);
      expect(res.body.books).to.be.an('array').and.be.empty;

      state.userId = res.body.userID;
    });
  });

  it('Gerar um token de acesso', () => {
    cy.apiGenerateToken(state.userName, state.password).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('status', 'Success');
      expect(res.body).to.have.property('result', 'User authorized successfully.');
      expect(res.body).to.have.property('token').and.not.be.empty;
      expect(res.body).to.have.property('expires').and.not.be.empty;

      state.token = res.body.token;
    });
  });

  it('Confirmar que o usuário está autorizado', () => {
    cy.request({
      method: 'POST',
      url: '/Account/v1/Authorized',
      body: { userName: state.userName, password: state.password },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.eq(true);
    });
  });

  it('Listar os livros disponíveis', () => {
 cy.request({
      method: 'GET',
      url: '/BookStore/v1/Books',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.books).to.be.an('array').and.not.be.empty;
      expect(res.body.books[0]).to.include.all.keys(
        'isbn',
        'title',
        'subTitle',
        'author',
        'publish_date',
        'pages',
        'description',
        'website'
      );

      state.books = res.body.books;
    });
  });

  it('Alugar dois livros ', () => {
    // Escolhe 2 livros distintos aleatoriamente
    const chosen = Cypress._.sampleSize(state.books, 2);
    state.chosenIsbns = chosen.map((book) => book.isbn);

    cy.log(`Livros escolhidos: ${chosen.map((b) => b.title).join(' | ')}`);

    cy.request({
      method: 'POST',
      url: '/BookStore/v1/Books',
      headers: { Authorization: `Bearer ${state.token}` },
      body: {
        userId: state.userId,
        collectionOfIsbns: state.chosenIsbns.map((isbn) => ({ isbn })),
      },
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.books).to.have.length(2);
      expect(res.body.books.map((b) => b.isbn)).to.have.members(state.chosenIsbns);
    });
  });

  it('Listar os detalhes do usuário com os livros escolhidos', () => {
    cy.request({
      method: 'GET',
      url: `/Account/v1/User/${state.userId}`,
      headers: { Authorization: `Bearer ${state.token}` },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('userId', state.userId);
      expect(res.body).to.have.property('username', state.userName);
      expect(res.body.books).to.have.length(2);
      expect(res.body.books.map((b) => b.isbn)).to.have.members(state.chosenIsbns);
    });
  });
});