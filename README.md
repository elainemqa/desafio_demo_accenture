
Fluxo automatizado sobre a API DemoQA (https://demoqa.com)

1. Criar usuário – POST /Account/v1/User
2. Gerar token – POST /Account/v1/GenerateToken
3. Confirmar autorização – POST /Account/v1/Authorized
4. Listar livros – GET /BookStore/v1/Books
5. Alugar 2 livros (aleatórios) – POST /BookStore/v1/Books
6. Detalhes do usuário com os livros – GET /Account/v1/User/{userID}
7. o usuário criado é removido (DELETE /Account/v1/User/{userID}).