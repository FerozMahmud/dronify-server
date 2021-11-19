const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(express.json());
app.use(cors())

// MongoDB Connection 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z1ceq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database
client.connect((err) => {
    const productsCollection = client.db("dronify").collection("products");
    const reviewCollection = client.db("dronify").collection("reviews");
    const usersCollection = client.db("dronify").collection("users");

    // Add Products 
    app.post("/addproduct", async (req, res) => {
        const result = await productsCollection.insertOne(req.body)
        res.send(result.acknowledged);
    });

    // Get All Products
    app.get("/products", async (req, res) => {
        const result = await productsCollection.find({}).toArray();
        res.send(result);
    });

    // Delete Products 
    app.delete("/deleteproduct/:id", async (req, res) => {
        const result = await productsCollection.deleteOne({ _id: ObjectId(req.params.id), });
        res.send(result);
    });


    // Get Single Products 
    app.get("/singleProduct/:id", (req, res) => {
        console.log(req.params.id);
        productsCollection
            .findOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                console.log(result);
                res.send(result);
            })
    });

    // Update Products
    app.put("/update/:id", async (req, res) => {
        const id = req.params.id;
        const updateInfo = req.body;
        const filter = { _id: ObjectId(id) };
        productsCollection
            .updateOne(filter,
                {
                    $set: {
                        name: updateInfo.name,
                        price: updateInfo.price,
                    },
                }
            )
            .then((result) => {
                res.send(result);
            })
    });

    // Add Riviews
    app.post("/addreview", async (req, res) => {
        const result = await reviewCollection.insertOne(req.body)
        res.send(result.acknowledged);
    });

    // Get Reviews
    app.get("/reviews", async (req, res) => {
        const result = await reviewCollection.find({}).toArray();
        res.send(result);
    });
});


app.get('/', (req, res) => {
    res.send('Server is runnig')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})