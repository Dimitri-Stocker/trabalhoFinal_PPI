import express from 'express';

//Cria servidor
const server = express();


//Processa parâmetros da URL
server.use(express.urlencoded({ extended: true }));

//Variável global para lista de livros
var listaLivros = [];


//Página Principal
server.get('/', (requisicao, resposta) => {
    resposta.write(`
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Página Inicial</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

        <body>
        <nav class="navbar navbar-expand-lg bg-body-tertiary py-2 px-5">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Biblioteca</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastroLivros">Livros</a></li>
                                <li><a class="dropdown-item" href="/cadastroLeitores">Leitores</a></li>
                               
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/listaLivros">Livros Cadastrados</a></li>
                                <li><a class="dropdown-item" href="/listaLeitores">Leitores Cadastrados</a></li>
                            </ul>
                        </li>

                         <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Minha Conta
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/login">Login</a></li>
                                
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/logout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
         </nav>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>
    `);
    resposta.end();
});

//Página de Cadastro de Livros
server.get('/cadastroLivros', (requisicao, resposta) => {
    resposta.send("Cadastro de Livros Ok.");
});

//Página da Lista de Livros
server.get('/listaLivros', (requisicao, resposta) => {
    resposta.send("Lista de Livros Ok.");
});

//Página de Cadastro de Leitores
server.get('/cadastroLeitores', (requisicao, resposta) => {
    resposta.send("Leitores Ok.");
});


//Página de Login
server.get('/login', (requisicao, resposta) => {
    resposta.write(`
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
                <link href="https://getbootstrap.com/docs/5.3/assets/css/docs.css" rel="stylesheet">
                <title>Página de Login</title>
                <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
            </head>

            <body class="p-3 m-0 border-0 bd-example m-0 border-0">
               <div class="container w-50">
                    <form action="/login" method="POST">
                    <div class="row">
                        <h1 class="text-center fw-bold">LOGIN</h1>
                        <h6 class="display-6 text-center">Por favor realize o Login para acessar a aplicação.</h6>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" name="email">
                    </div>

                    <div class="mb-3">
                        <label for="senha" class="form-label">Senha:</label>
                        <input type="password" class="form-control" id="senha" name="senha">
                    </div>

                    <button type="submit" class="btn btn-success w-100 fw-bold mb-2"> Entrar </button>
                    <a href="/" class="btn btn-primary w-100">Página Inicial</a>
                    </form>
                </div>
            </body>
            </html>
    `);
    resposta.end();
});

//Página de Logout
server.get('/logout', (requisicao, resposta) => {
    resposta.send("Logout Ok.");
});

//Confere se o servidor está escutando
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor escutando na porta ${port}`);
});