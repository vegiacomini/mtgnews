const express = require('express')
const bodyParser = require('body-parser');
const {
    ObjectId
} = require('mongodb');
const app = express()

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://teste:teste1234@cluster0.hxtyoi1.mongodb.net/?retryWrites=true&w=majority"

//Conectar
MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crude-nodejs')

    app.listen(8080, function () {
        console.log('Servidor rodando...')
    })
})

app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('view engine', 'ejs')
app.use(express.static("views"));

app.get('/', (req, res) => {
    res.render('index.ejs')

})

//Listar
app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', {
            data: results
        })

    })
})
//INSERT
app.post('/show', (req, res) => {
    db.collection('data').insertOne(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('Salvo com sucesso')
        res.redirect("/show")

    })
})


//UPDATE
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname

  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})


//DELETE
app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id


    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result)=>{
        if(err) return res.send(500,err)
        console.log('Deletado com suesso')
        res.redirect("/show")
    })
})
