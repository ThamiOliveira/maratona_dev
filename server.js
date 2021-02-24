//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))


//habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

//configurar a conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'thami1405',
    host: 'localhost',
    port: 5432,
    database: 'doe' // banco de dados que esta se conectando 
})


//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean ou booleano aceita 2 valores, verdadeiro ou falso
})


//configurar a apresentação da página
server.get("/", function (req, res) {
    db.query("select * from donors", function (err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })


})

server.post("/", function (req, res) {
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocando valores dentro do Banco de dados
    const query =
        `insert into donors ("name", "email", "blood") values ($1, $2, $3)` // 'donor' a tabela que vc esta usando

    const values = [name, email, blood]

    db.query(query, values, function (err) {
        //fluxo de erro
        if (err) return console.log(err);
        //res.send("erro no banco de dados")

        //fluxo ideal
        return res.redirect("/")
    })



})

//ligar o servidor e permitir na porta 3000
server.listen(3000, function () {
    console.log("iniciei o servidor.")
})