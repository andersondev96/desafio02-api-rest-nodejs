# Desafio 02 - Criando API RESTfull com Node.js
Este desafio faz parte do módulo 2 da trilha de Node.js do Ignite da Rocketseat.

## Sobre a aplicação
Com esta aplicação é possível o usuário cadastrar uma refeição informando o seu título, descrição, data e hora e se faz parte da dieta.
Além de cadastrar as refeições, é possível listar todas refeições, visualizar uma refeição específica, editar refeições, remover refeições e também visualizar as métricas do usuário como: total de refeições cadastradas, total de refeições fora e dentro da dieta e maior sequência de refeições dentro da dieta.

## Requisitos funcionais (RF)

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível registrar uma refeição feita
- [x] Deve ser possível editar uma refeição
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
    - [x] Quantidade total de refeições registradas
    - [x] Quantidade total de refeições dentro da dieta
    - [x] Quantidade total de refeições fora da dieta
    - [x] Melhor sequência de refeições dentro da dieta

## Regras de Negócio (RN)
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] O usuário só pode visualizar, editar e apagar as refeições que ele criou

## Rotas da aplicação
- *POST /users*: Deve ser possível criar um novo usuário, enviando pela requisição o *nome, username, email e senha*.

- *POST /meals*: Deve ser possível criar uma nova refeição, enviando pela requisição o *nome, descrição, data e hora e se está dentro da dieta ou não*.

- *GET /meals*: Deve ser possível listar todas as refeições cadastradas pelo usuário.

- *GET /meals/:id*: Deve retornar a refeição recebendo um id no parâmetro.

- *GET /meals/summary*: Deve retornar todas as métricas do usuário, tais como: Total de refeições cadastradas pelo usuário, total de refeições dentro e fora da dieta e sequência de refeições dentro da dieta.

- *PUT /meals/:id*: Deve ser possível editar uma refeição cadastrada. O usuário deve passar como parâmetro o id da refeição e no corpo as informações que serão atualizadas.

- *DELETE /meals/:id*: Permite apagar refeições do banco de dados.

## Como executar a aplicação
Para executar a aplicação siga os seguintes passos:

- Clone e acesse o repositório:
```
git clone https://github.com/andersondev96/ignite-nodejs-2023-desafio02-api-rest-nodejs
```
```
cd ignite-nodejs-2023-desafio02-api-rest-nodejs
```

- Instale as dependências do projeto:
```
npm install
```
- Adicione as seguintes chaves no .env:
```
NODE_ENV=development
DATABASE_CLIENT=sqlite
DATABASE_URL="./db/app.db"
```

- Execute as migrations:
```
npm run knex -- migrate:latest
```   
- Execute o projeto com o comando:
```
npm run dev
```
- O servidor irá rodar na porta **localhost:3333**

## Licença

Este projeto está sob a licença [MIT](LICENSE).

## Autor

<img src="https://avatars.githubusercontent.com/u/49786548?v=4" width="64" style="border: 2px solid blue; border-radius: 50px" />

**Anderson Fernandes Ferreira**

[![instagram](https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/anderson_ff13)
[![email](https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white)](mailto:andersonfferreira96@gmail.com.br)
[![linkedin](https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anderson-fernandes96/)

Feito com 💚 por Anderson Fernandes 👋 [Entre em contato!](https://www.linkedin.com/in/anderson-fernandes96/)

