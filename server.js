// server.js
const express = require('express')
const bodyParser = require('body-parser')
const connectionString = 'mongodb+srv://GabiDB:es96301p@cluster0-gdqej.mongodb.net/Remgeta-DB?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient
const app = express()
const multer = require('multer')

app.listen(3000, function () {
    console.log('listening on 3000')
})

// Database Connection and Handlers
MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('Remgeta-DB')
        const tractorCollection = db.collection('tractors')
        const productCollection = db.collection('Product')


        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
        app.use(express.static('public'))


        app.get('/parduotuve', (req, res) => {
            db.collection('Category').find().toArray()
                .then(results => {
                    res.render('Parduotuve.ejs', {Category: results})
                })
                .catch(error => console.error(error))
        })

        app.get('/parduotuve/:categoryName', async (req,res) => {

            const category = await db.collection('Category').findOne({Name: req.params.categoryName})
            const subcategories = await db.collection('Subcategory').find({CategoryID: category._id.toString()}).toArray()

            res.render('Subkategorija.ejs', {category : category, subcategories: subcategories})
        })

        app.get('/parduotuve/:categoryName/:subCategoryName', async (req,res) => {

            const category = await db.collection('Category').findOne({Name: req.params.categoryName})
            const subcategory = await db.collection('Subcategory').findOne({Name: req.params.subCategoryName})
            const categoryItem = await db.collection('Product').find({SubCategoryID: subcategory._id.toString()}).toArray()
            res.render('Produktai.ejs', {products: categoryItem, category: category, subcategory: subcategory})
        })

        app.get('/parduotuve/:categoryName/:subCategoryName/:productName', async (req,res) => {

            const category = await db.collection('Category').findOne({Name: req.params.categoryName})
            const subcategory = await db.collection('Subcategory').findOne({Name: req.params.subCategoryName})
            const categoryItem = await db.collection('Product').findOne({Name: req.params.productName})
            res.render('Produktas.ejs', {product: categoryItem, category: category, subcategory: subcategory})
        })
        
        /* Test */
        app.get('/traktoriai', (req, res) => {
            db.collection('tractors').find().toArray()
                .then(results => {
                    res.render('tractors.ejs', {tractors: results})
                })
                .catch(error => console.error(error))
        })

        app.post('/tractors', (req, res) => {
            tractorCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/traktoriai')
                })
                .catch(error => console.error(error))
        })

        app.put('/tractors', (req, res) => {
            tractorCollection.findOneAndUpdate(
                {model: 'Claas'},
                {
                    $set: {
                        model: req.body.model,
                        type: req.body.type
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => res.json('Success'))
                .catch(error => console.error(error))
        })

        app.delete('/tractors', (req, res) => {
            tractorCollection.deleteOne(
                {model: req.body.model},
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No model to delete')
                    }
                    res.json('Deleted Model')
                })
                .catch(error => console.error(error))
        })

        /* Test end */

        app.get('/shopID', (req, res) => {
            productCollection.find(req.body.CategoryID).toArray()
                .then(results => res.json('Success'))

                //res.render('Produktai.ejs')

                .catch(error => console.error(error))
        })

    })
    .catch(error => console.error(error))


// Common Handlers
app.get('/', (req, res, next) => {
    res.render('index.ejs')
})
app.get('/paslaugos/priedugamyba', (req, res) => {
    res.render('PrieduGamyba.ejs')
})
app.get('/paslaugos/nuoma', (req, res) => {
    res.render('Nuoma.ejs')
})
app.get('/paslaugos/technineapziura', (req, res) => {
    res.render('TechnineApziura.ejs')
})
app.get('/paslaugos/remontas', (req, res) => {
    res.render('Remontas.ejs')
})
app.get('/paslaugos/tekinimasirfrezavimas', (req, res) => {
    res.render('TekinimasIrFrezavimas.ejs')
})
app.get('/paslaugos/suvirinimas', (req, res) => {
    res.render('Suvirinimas.ejs')
})
app.get('/info/apie', (req, res) => {
    res.render('Apiemus.ejs')
})
app.get('/info/prekiuuzsakymas', (req, res) => {
    res.render('PrekiuUzsakymas.ejs')
})
app.get('/info/prekiugrazinimas', (req, res) => {
    res.render('PrekiuGrazinimas.ejs')
})
app.get('/gallery', (req, res) => {
    res.render('Galerija.ejs')
})
app.get('/contacts', (req, res) => {
    res.render('Kontaktai.ejs')
})

