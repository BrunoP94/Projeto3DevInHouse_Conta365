#Projeto Avaliativo 3 - Conta365
##DEVinBank Pagamentos S.A.
####Bruno Alberto Pacheco

**Table of Contents**

[TOCM]

[TOC]

### Introdução
Este documento tem como objetivo apresentar os detalhes e lógicas do códido desenvolvido para o Projeto Avaliativo 3 - do curso DevInHouse.
O código consiste no back-end de uma aplicação financeira, Conta365, feito com NodeJs e express. 
O documento está divido em 3 partes principais:
- Estrutura do Projeto
	Apresenta como o projeto está organizado em suas pastas.
- Descrição dos Endpoints
	Descreve os endpoints do projeto, explicando quais são as informações necessárias em cada ponto, quais as validações realizadas, e quais as possíveis respostas.
- Outros Pontos Relevantes
	Demais informações úteis para compreensão e avaliação do projeto.

### Estrutura do Projeto
O projeto possui a seguinte disposição de pastas e arquivos:
- node_modules
- src
Pasta com as lógicas, descrição de rotas e definições do servidor. As seguintes informações estão dispostas:
	- controllers
		Pasta com as regras de negócio da aplicação. Possui dois arquivos, financialController e userController, sendo cada um responsável pelas regras de negócio das finanças e usuários, respectivamente.
	- database
		Pasta que contém base de dados do projeto. Os arquivos user.json e financial.json possuem os dados de usuários e finanças dos usuários, respectivamente. Todas as futuras modificações de usuários ou finanças, descritos a seguir, farão modificações nestes arquivos .json.
        O arquivo users.json é padronizado da seguinte forma:
        > [{"id": number, "name": string, "email": string},  ...]
		
        O arquivo financial.json é padronizado da seguinte forma:
        > [{"id": number ,"userId": number, "financialData":[{"id": number, "price": number, "typesOfExpenses": string, "date": string, "name": string},...]}]
        O valor de date deve ser no formato: "yyyy-mm-ddThh:mm:ss.sZ"
	- routes
		Pasta que contém a descrição das rotas. Possui versionamento separado na pasta v1. Dentro desta pasta, são separadas as rotas referentes aos endpoints para usuários e para as finanças nos arquivos user.routes e financial.routes respectivamente.
		Por fim, na pasta routes, existe o arquivo index.js, que agrega e exporta todas as rotas descritas acima.
	- utils
		Contém um arquivo function.js, que possui duas diferentes funções: getData e createOrUpdatedata. 
		A função getData é responsável por abrir as informações de um arquivo salvo na pasta database. A função recebe como parâmetro o nome de um arquivo.
		A função createOrUpdatedata é responsável por reescrever alguns arquivos na pasta database. A recebe como parâmetros o arquivo que será salvo, e o nome do arquivo, respectivamente.
	- server.js
		Arquivo onde o servidor é instanciado. Neste arquivo são importadas as rotas, descritas anteriorente, e define a porta '3333' como porta do servidor.
	- swagger.json
		Arquivo swagger que documenta as informações dos endpoints. O arquivo permite que os endpoints sejam acessados facilmente através da porta: http://localhost:3333/api-docs

### Descrição dos Endpoints
#### User Endpoints 
O projeto contém os seguintes endpoints, para trabalhar com informações de usuário:
- /v1/users
Método: POST
Descrição: Endpoint utilizado para criar um novo usuário.
Regras de negócio: Para utilização do entpoint é necessário enviar via body as informações de "name" e "email".
A função assíncrona "create" no "userController" contém as seguintes regras de validação para este endpoint:
	- os campos "name" e "email" são obrigatórios no body;
	- os campos "name" e "email" não podem estar vazios;
	- os campos "name" e "email" devem estar preenchidos com strings.
Quaisquer informações adicionais enviadas no body são ignoradas.
Caso algumas das validações acima não seja aprovada, é gerado um erro do tipo 400.
O id é gerado dinamicamente pelo código, levando em consideração todos os ids já existentes no arquivo user.json.
Se as informações vierem de maneira correta, o usuário é criado e salvo no arquivo user.json, e é gerada uma resposta do tipo 201.
O objeto abaixo mostra o exemplo das informações que devem ser enviadas no body.

```json
{
	"name": "Maria",
	"email": "maria@email.com"
}
```

- /v1/user/:{UserId}
Método: PATCH
Descrição: Endpoint utilizado para atualizar as informações de um usuário já existente.
Regras de negócio: Para utilização do endpoint é necessário enviar as informações de "name" e "email" atualizadas no body, e o id do usuário via params.
A função assíncrona "updateOne" no "userController" contém as seguintes regras de validação para este endpoint:
	- os campos "name" e "email" são obrigatórios no body;
	- os campos "name" e "email" não podem estar vazios;
	- os campos "name" e "email" devem estar preenchidos com strings;
	- o id informado no params deve ser um número referente à um usuário existente.
Quaisquer informações adicionais enviadas no body são ignoradas.
Caso algumas das validações acima não seja aprovada, é gerado um erro do tipo 400.
Se as informações vierem de maneira correta, o usuário é atualizado e salvo no arquivo user.json, e é gerada uma resposta do tipo 200.
Abaixo são mostrados os exemplos das informações que devem ser enviadas via params e body.

Params:
```
http://localhost:3333/v1/user/5
```
Body:
```json
{
	"name": "Maria",
	"email": "maria@email.com"
}
```
- /v1/user/:{UserId}
Método: GET
Descrição: Endpoint utilizado para apresentar informações de um usuário.
Regras de negócio: Para utilização do endpoint é necessário enviar o id do usuário via params.
A função assíncrona "indexOne" no "userController" contém as seguintes regras de validação para este endpoint:
	- o id informado no params deve ser um número referente à um usuário existente.
Caso a validação acima não seja aprovada, é gerado um erro do tipo 400.
Se a informação vier de maneira correta, o usuário é mostrado na resposta, do tipo 200.
Abaixo é mostrado o exemplo da informação que deve ser enviada via params.

```
http://localhost:3333/v1/user/5
```
#### Financial Endpoints 
O projeto contém os seguintes endpoints, para trabalhar com informações de financeiro:

- /v1/finances/:{UserId}
Método: POST
Descrição: Endpoint utilizado para criar informações de finanças, atreladas à um usuário.
Regras de negócio: Para utilização do endpoint é necessário enviar um arquivo xlsx, via Multipart Form, e o id do usuário via params.
A função assíncrona "uploadXLSX" no "financialController" contém as seguintes regras de validação para este endpoint:
	- o id informado no params deve ser um número referente à um usuário existente;
	- o arquivo enviado deve possuir a extensão .xlsx
	- o cabeçalho do arquivo xlsx deve conter as informações:
| price | typesOfExpenses | date | name |
	- todas as colunas do xlsx devem estar preenchidas;
Caso alguma das validações acima não seja aprovada, é gerado um erro do tipo 400.
Se as informações vierem de maneira correta, as finanças são atualizadas no arquivo financial.json, e é gerada uma resposta do tipo 201

Abaixo são apresentadas as informações que devem ser enviadas no params, e no arquivo xlsx:

|price|typesOfExpenses|date|name|
| :------------: |
|49,90|jantar|2021-01-21T12:00:13.908Z|pedido por delivery|
Os valores devem estar no formato:

|price|typesOfExpenses|date|name|
| :------------: |
|number|string|string|string|

Params:
```
http://localhost:3333/v1/finances/5
```

- /v1/finances/:{UserId}/:{financialId}
Método: DELETE
Descrição: Endpoint utilizado para deletar uma informação de finanças, atreladas à um usuário.
Regras de negócio: Para utilização do endpoint é necessário enviar o id do usuário, e o id da finança que será deletada, via params.
A função assíncrona "deleteOne" no "financialController" contém as seguintes regras de validação para este endpoint:
	- o UserId informado no params deve ser um número referente à um usuário existente;
	- o FinancialId informado no params deve ser um número referente à uma despesa existente;
Caso alguma das validações acima não seja aprovada, é gerado um erro do tipo 400.
Se as informações vierem de maneira correta, a finança especificada é deletada, o arquivo financial.json é atualizado, e é gerada uma resposta do tipo 200.
Após deletar a despesa especificada, os ids referentes às finanças são alterados dinamicamente.

Abaixo são apresentadas as informações que devem ser enviadas no params:
```
http://localhost:3333/v1/finances/5/1
```

- /v1/finances/:{UserId}?expensesType
Método: GET
Descrição: Endpoint utilizado para apresentar as informações de finanças de um usuário, filtradas por mês/ano. Além disso, também é possível passar um parâmetro de filtro via query para que sejam apresentadas somente as finanças selecionadas.
Regras de negócio: Para utilização do endpoint é necessário enviar o id do usuário via params. Opcionalmente, pode ser enviado via query o valor de filtro para o campo typeOfExpenses, para que sejam apresentadas somente as despesas do tipo solicitado
A função assíncrona "idexMonthYear" no "financialController" contém as seguintes regras de validação para este endpoint:
	- o UserId informado no params deve ser um número referente à um usuário existente.
Caso a validação acima não seja aprovada, é gerado um erro do tipo 400.
Caso o usuário exista, porém não possua despesas listadas, é enviada uma resposta do tipo 200, com essa informação.
Se as informações vierem de maneira correta, é retornada a lista de despesas, separadas por mês e  ano, com uma resposta do tipo 200.
Abaixo é apresentado o exemplo com as informações que devem ser enviadas no params, e opcionalmente, no query:
```
http://localhost:3333/v1/finances/2?expensesType=mercado
```

### Outros Pontos Relevantes
#### Docuentação
A documentação dos endpoints realizada pelo swagger, através do arquivo swagger.json está apresentando problemas no envio do arquivo xlsx. Portanto, para o teste deste endpoint é recomendado utilizar outro aplicativo, como o Insomnia.
Demais endpoints, acessados via http://localhost:3333/api-docs, devem funcionar corretamente.

#### Automatização Swagger
Encontrei alguns problemas com o processo de automatização da documentação do swagger. Dessa forma, criei manualmente a descrição dos endpoints, e tentei elucidar o máximo possível as descrições neste arquivo readme.md, para que a compreensão do código seja possível para o avaliador.

#### Database
A pasta database também contém um arquivo xlsx com algumas informações preenchidas, caso seja necessário adicionar despesas em algum usuário.