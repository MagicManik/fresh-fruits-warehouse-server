const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// _______ MIDDLEWARE _______
app.use(cors());
app.use(express.json());






function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}





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
        });


        // _______ TO LOAD MULTIPLE DATA FROM DATABASE _____
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });








        // get or find inventory data of user
        app.get('/stock', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            console.log(decodedEmail)
            const email = req.query.email;

            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = inventoryCollection.find(query);
                const inventorys = await cursor.toArray();
                res.send(inventorys);
            }
            else {
                res.status(403).send({ message: 'forbidden access' })
            }
        })





        // USUE TOKEN WHEN USER LOGIN
        app.post('/login', async (req, res) => {
            const user = req.body;
            // console.log(user)
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ accessToken });
        });




        // ______ LOAD DATA FOR SPECIFIC USER USING SEARCH QUERY ____
        // app.get('/inventory', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email };
        //     const cursor = inventoryCollection.find(query);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // });



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