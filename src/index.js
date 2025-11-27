const express = require('express');

class AppController {
    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json());
    }

    routes(){
        const apiRoutes = require('./routes/apiRoutes');
        this.express.use('/estoque', apiRoutes);
    }
}

module.exports = new AppController().express;

/*

    Aprendizados:
- Por que usar classes?
As classes servem para modularizar e organizar o código, isso facilita o crescimento
do projeto, para qunado ele ficar grande, esteja organizado e funcional.

- O que é uma instância?
Instancia é o objeto da classe, ou seja, a classe serve como 
um molde, suas instancias são o uso desse molde aplicado.

- O que são middlewares?
Os middlewares são intermediadores, eles processam a requisição 
ANTES de chegar nas rotas, fazendo uma função / tarefa repetitiva.

*/