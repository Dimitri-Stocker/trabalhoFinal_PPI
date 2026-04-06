import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

//Cria servidor
const server = express();

//Sessão
server.use(session({
    secret: "Ch4v3S3cr3t4",
    resave: true,
    saveUninitialized: true,
    cookie : {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30      //Login válido por 30 minutos
    }
}));


//Processa parâmetros da URL
server.use(express.urlencoded({ extended: true }));

//Cookies
server.use(cookieParser());

//Variável global para lista de livros
var listaLivros = [];

//Variável global para lista de leitores
var listaLeitores = [];


//Página Principal
server.get('/', estaAutenticado, (requisicao, resposta) => {

    //Último acesso do usuário na tela de menu do sistema
    const ultimoAcesso = requisicao.cookies?.ultimoAcesso || "Nunca acessou.";

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
                                <li><a class="dropdown-item" href="/logout">Logout</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item">Último Acesso: ${ultimoAcesso}</a></li>
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
server.get('/cadastroLivros', estaAutenticado, (requisicao, resposta) => {
      resposta.write(`
         <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Cadastro de Livros</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

         <body>
        <div class="container mt-4">
            <div class="card p-4 shadow-sm">
                <h5 class="display-5 fw-normal text-center">Cadastro de Livros </h5>
                <form action="/cadastroLivros" method="POST">
                    <div class="row">

                        <div class="col-12 mb-3">
                            <label for="tituloLivro" class="form-label">Título do Livro: </label>
                            <input type="text" class="form-control" id="tituloLivro" name="tituloLivro">
                        </div>

                        <div class="col-12 mb-3">
                            <label for="autor" class="form-label">Nome do Autor: </label>
                            <input type="text" class="form-control" id="autor" name="autor">
                        </div>

                        <div class="col-12 mb-3">
                            <label for="isbn" class="form-label">Código ISBN: </label>
                            <input type="text" class="form-control" id="isbn" name="isbn" placeholder="Ex: 978-85-333-0400-5">
                        </div>

                    </div>

                    <button type="submit" class="btn btn-success fw-bold w-100 p-2 mt-3 mb-2">Cadastrar</button>
                    <a href="/" class="btn btn-primary w-100 p-2">Página Inicial</a>
                </form>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>
        `);
        resposta.end();
});

//Processamento do Cadastro de Livros
server.post('/cadastroLivros', estaAutenticado, (requisicao, resposta) => {
    const tituloLivro = requisicao.body.tituloLivro;
    const autor = requisicao.body.autor;
    const isbn = requisicao.body.isbn;

    //impedir que campo vazio seja cadastrado
    if (!tituloLivro || !autor || !isbn) {
        let html = `
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Cadastro de Livros</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

        <body>
        <div class="container mt-4">
            <div class="card p-4 shadow-sm">
                <h5 class="display-5 fw-normal text-center">Cadastro de Livros </h5>
                <form action="/cadastroLivros" method="POST">
                    <div class="row">

                        <div class="col-12 mb-3">
                            <label for="tituloLivro" class="form-label">Título do Livro: </label>
                            <input type="text" class="form-control" id="tituloLivro" name="tituloLivro" value="${tituloLivro}">`;
                        if (!tituloLivro) {
                            html += `
                                <div class="text-danger mt-1">Campo obrigatório!</div>`;
                        }
                        html += `
                        </div>
                        
                        <div class="col-12 mb-3">
                            <label for="autor" class="form-label">Nome do Autor: </label>
                            <input type="text" class="form-control" id="autor" name="autor" value="${autor}">`;
                        if (!autor) {
                            html += `
                                <div class="text-danger mt-1">Campo obrigatório!</div>`;
                        }
                        html += `
                        </div>

                         <div class="col-12 mb-3">
                            <label for="isbn" class="form-label">Código ISBN: </label>
                            <input type="text" class="form-control" id="isbn" name="isbn" placeholder="Ex: 978-85-333-0400-5" value="${isbn}">`;
                        if (!isbn) {
                            html += `
                                <div class="text-danger mt-1">Campo obrigatório!</div>`;
                        }
                        html += `
                        </div>
                    </div>

                    <button type="submit" class="btn btn-success fw-bold w-100 p-2 mt-3 mb-2">Cadastrar</button>
                    <a href="/" class="btn btn-primary w-100 p-2">Página Inicial</a>
                </form>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>`;

        resposta.write(html);
        resposta.end();
    }

    else {
        listaLivros.push(
            {
                "tituloLivro": tituloLivro,
                "autor": autor,
                "isbn": isbn
            }
        );

        resposta.redirect('/listaLivros');
    }
});

//Página da Lista de Livros
server.get('/listaLivros', estaAutenticado, (requisicao, resposta) => {
    resposta.write(`
   <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Livros Cadastrados</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head> 
        
        <body>
            <div class="container">
              <h5 class="display-5 fw-normal text-center">Livros Cadastrados </h5>
                    <table class="table table-striped table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Título do Livro</th>
                                <th scope="col">Autor</th>
                                <th scope="col">Código IBSN</th>
                            </tr>
                        </thead>
                        <tbody>`);

    for (let i = 0; i < listaLivros.length; i++) {
        const livro = listaLivros[i];
        resposta.write(`
            <tr>
                <td>${livro.tituloLivro}</td>
                <td>${livro.autor}</td>
                <td>${livro.isbn}</td>
            </tr>
        `);
    }

    resposta.write(`
                        </tbody>
                    </table>

                    <a href="/cadastroLivros" class="btn btn-success fw-bold w-100 p-2 mb-2"> Continuar Cadastrando </a>
                    <a href="/" class="btn btn-primary fw-bold w-100 p-2"> Página Inicial </a>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>`);
    resposta.end();
});

//Página de Cadastro de Leitores
server.get('/cadastroLeitores', estaAutenticado, (requisicao, resposta) => {
    resposta.write(`
         <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Cadastro de Leitores</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head> 

        <body>
        <div class="container mt-4">
            <div class="card p-4 shadow-sm">
                <h5 class="display-5 fw-normal text-center">Cadastro de Leitores</h5>
                <form action="/cadastroLeitores" method="POST">

                <div class="row g-3">

                    <div class="col-md-6">
                        <label for="nomeLeitor" class="form-label">Nome do Leitor: </label>
                        <input type="text" class="form-control" id="nomeLeitor" name="nomeLeitor">
                    </div>

                    <div class="col-md-3">
                        <label for="cpf" class="form-label">CPF: </label>
                        <input type="text" class="form-control" id="cpf" name="cpf" placeholder="000.000.000-00">
                    </div>

                    <div class="col-md-3">
                        <label for="telefone" class="form-label">Telefone: </label>
                        <input type="text" class="form-control" id="telefone" name="telefone" placeholder="(00) 00000-0000">
                    </div>
    
                    <div class="col-md-3">
                        <label for="dataEmprestimo" class="form-label">Data de Empréstimo: </label>
                        <input type="date" class="form-control" id="dataEmprestimo" name="dataEmprestimo">
                    </div>

                    <div class="col-md-3">
                        <label for="dataDevolucao" class="form-label">Data de Devolução: </label>
                        <input type="date" class="form-control" id="dataDevolucao" name="dataDevolucao">
                    </div>

                    <div class="col-md-6">
                        <label for="tituloLivro" class="form-label">Título do Livro</label>
                        <select class="form-select" id="tituloLivro" name="tituloLivro">
                        <option value ="" selected>Selecione um livro</option>`);
                        
                        //Livros somente aparecem se forem cadastrados. Mesma lógica da lista de livros cadastrados. 
                        for (let i = 0; i < listaLivros.length; i++) {
                            const livro = listaLivros[i];
                            resposta.write(`
                                <option value="${livro.tituloLivro}">${livro.tituloLivro}</option>
                            `);
                        }
                       
                        resposta.write(`
                        </select>
                    </div>

                </div>

                <button type="submit" class="btn btn-success fw-bold w-100 p-2 mt-3 mb-2">Cadastrar</button>
                <a href="/" class="btn btn-primary w-100 p-2">Página Inicial</a>

                </form>
            </div>
        </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>`);
    resposta.end();
});

//Processamento do Cadastro de Leitores
server.post('/cadastroLeitores', estaAutenticado, (requisicao, resposta) => {
    const nomeLeitor = requisicao.body.nomeLeitor;
    const cpf = requisicao.body.cpf;
    const telefone = requisicao.body.telefone;
    const dataEmprestimo = requisicao.body.dataEmprestimo;
    const dataDevolucao = requisicao.body.dataDevolucao;
    const tituloLivro = requisicao.body.tituloLivro;

    //impedir que campo vazio seja registrado
    if (!nomeLeitor || !cpf || !telefone || !dataEmprestimo || !dataDevolucao || !tituloLivro) {
        let html = `
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Cadastro de Leitores</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head> 

        <body>
        <div class="container mt-4">
            <div class="card p-4 shadow-sm">
                <h5 class="display-5 fw-normal text-center">Cadastro de Leitores</h5>
                <form action="/cadastroLeitores" method="POST">

                <div class="row g-3">

                    <div class="col-md-6">
                        <label for="nomeLeitor" class="form-label">Nome do Leitor: </label>
                        <input type="text" class="form-control" id="nomeLeitor" name="nomeLeitor" value="${nomeLeitor}">`;
                    if (!nomeLeitor) {
                        html += `
                            <div class="text-danger mt-1">Campo obrigatório!</div>`;
                    }
                    html += `
                    </div>

                     <div class="col-md-3">
                        <label for="cpf" class="form-label">CPF: </label>
                        <input type="text" class="form-control" id="cpf" name="cpf" placeholder="000.000.000-00" value="${cpf}">`;
                    if (!cpf) {
                        html += `
                            <div class="text-danger mt-1">Campo obrigatório!</div>`;
                    }
                    html += `
                    </div>

                    <div class="col-md-3">
                        <label for="telefone" class="form-label">Telefone: </label>
                        <input type="text" class="form-control" id="telefone" name="telefone" placeholder="(00) 00000-0000" value="${telefone}">`;
                    if (!telefone) {
                        html += `
                            <div class="text-danger mt-1">Campo obrigatório!</div>`;
                    }
                    html += `
                    </div>

                    <div class="col-md-3">
                        <label for="dataEmprestimo" class="form-label">Data de Empréstimo: </label>
                        <input type="date" class="form-control" id="dataEmprestimo" name="dataEmprestimo" value="${dataEmprestimo}">`;
                    if (!dataEmprestimo) {
                        html += `
                            <div class="text-danger mt-1">Campo obrigatório!</div>`;
                    }
                    html += `
                    </div>

                    <div class="col-md-3">
                        <label for="dataDevolucao" class="form-label">Data de Devolução: </label>
                        <input type="date" class="form-control" id="dataDevolucao" name="dataDevolucao" value="${dataDevolucao}">`;
                    if (!dataDevolucao) {
                        html += `
                            <div class="text-danger mt-1">Campo obrigatório!</div>`;
                    }
                    html += `
                    </div>

                    <div class="col-md-6">
                        <label for="tituloLivro" class="form-label">Título do Livro</label>
                        <select class="form-select" id="tituloLivro" name="tituloLivro">`;
                        if (!tituloLivro) {
                            html += `
                            <option value ="" selected> Selecione um livro </option>`;
                         
                        }

                        else {
                            html += `
                            <option value=""> Selecione um livro </option>`;
                          
                        }

                        for (let i = 0; i < listaLivros.length; i++) {
                            const livro = listaLivros[i];

                            if (livro.tituloLivro === tituloLivro) {
                                html += `
                                <option value="${livro.tituloLivro}" selected>${livro.tituloLivro}</option>`;
                            }

                            else {
                                html += `
                                <option value="${livro.tituloLivro}">${livro.tituloLivro}</option>`;
                            }
                        }

                        html += `
                        </select>`;

                        if (!tituloLivro) {
                            html += `
                                <div class="text-danger mt-1">Campo obrigatório!</div>`;
                        }

                        html += `
                    </div>
                </div>
                <button type="submit" class="btn btn-success fw-bold w-100 p-2 mt-3 mb-2">Cadastrar</button>
                <a href="/" class="btn btn-primary w-100 p-2">Página Inicial</a>

                </form>
            </div>
        </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>`;

        resposta.write(html);
        resposta.end();    
    }

    else {
        listaLeitores.push(
            {
                "nomeLeitor": nomeLeitor,
                "cpf": cpf,
                "telefone": telefone,
                "dataEmprestimo": dataEmprestimo,
                "dataDevolucao": dataDevolucao,
                "tituloLivro": tituloLivro
            }
        );

        resposta.redirect('listaLeitores');
    }
});

//Página da Lista de Leitores
server.get('/listaLeitores', estaAutenticado, (requisicao, resposta) => {
    resposta.write(`
       <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Leitores Cadastrados</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head> 

        <body>
        <div class="container">
              <h5 class="display-5 fw-normal text-center">Leitores Cadastrados </h5>
                    <table class="table table-striped table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Nome do Leitor</th>
                                <th scope="col">CPF</th>
                                <th scope="col">Telefone</th>
                                <th scope="col">Data de Empréstimo</th>
                                <th scope="col">Data de Devolução</th>
                                <th scope="col">Título do Livro</th>
                            </tr>
                        </thead>
                        <tbody>`);

        for (let i = 0; i < listaLeitores.length; i++) {
            const leitor = listaLeitores[i];
            resposta.write(`
            <tr>
                <td>${leitor.nomeLeitor}</td>
                <td>${leitor.cpf}</td>
                <td>${leitor.telefone}</td>
                <td>${leitor.dataEmprestimo}</td>
                <td>${leitor.dataDevolucao}</td>
                <td>${leitor.tituloLivro}</td>
            </tr>
            `);
        }

        resposta.write(`
            
            
                        </tbody>
                    </table>
                     <a href="/cadastroLeitores" class="btn btn-success fw-bold w-100 p-2 mb-2"> Continuar Cadastrando </a>
                    <a href="/" class="btn btn-primary fw-bold w-100 p-2"> Página Inicial </a>
        </div>
         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>`);

    resposta.end();
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
                    </form>
                </div>
            </body>
            </html>
    `);
    resposta.end();
});

//Processamento dos dados do Login
server.post('/login', (requisicao, resposta) => {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if (email == "admin@teste.com.br" && senha == "admin") {
        requisicao.session.logado = true;

        const dataUltimoAcesso = new Date();
        resposta.cookie("ultimoAcesso", dataUltimoAcesso.toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});

        resposta.redirect('/');
    }

    else {
        resposta.write(`
            <html lang="en">
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

                    <span>
                        <p class="text-danger">Email ou senha inválidos. </p>
                    </span>

                    <button type="submit" class="btn btn-success w-100 fw-bold mb-2"> Entrar </button>
                    </form>
                </div>
            </body>
            </html> `);
        resposta.end();
    }
});

//Página de Logout
server.get('/logout', (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
});

//Middleware
function estaAutenticado (requisicao, resposta, proximo) {
    if (requisicao.session?.logado) {
        proximo();
    }

    else {
        resposta.redirect("/login");
    }
};

//Confere se o servidor está escutando
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor escutando na porta ${port}`);
});