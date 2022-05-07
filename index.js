const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// _______ MIDDLEWARE _______
app.use(cors());
app.use(express.json());



// _______ CONNECTION SERVER TO DATABASE _______
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wceiw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('freshFruitsWarehouse').collection('inventory');


        // ______ TO INSERT DATA IN DATABASE ______
        app.post('/inventory', async (req, res) => {
            const item = req.body;
            const result = await inventoryCollection.insertOne(item);
            res.send(result);
        })





        // _______ TO LOAD SINGLE DATA FROM DATABASE ______
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollection.findOne(query);
            res.send(result);
        })


        // _______ TO LOAD MULTIPLE DATA FROM DATABASE _____
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        // // ______ TO UPDATE SINGLE DATA OF DATABASE _____
        // app.get('/inventory/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updateStock = req.body;

        //     console.log(req.body);

        //     const filter = { _id: ObjectId(id) };

        //     const options = { upsert: true };

        //     const updateDoc = {
        //         $set: {
        //             quantity: updateStock.quantity
        //         }
        //     };

        //     const result = await inventoryCollection.updateOne(filter, updateDoc, options);

        //     res.send(result);




        // })


    }

    finally {

    }
}

run().catch(console.div);






app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})