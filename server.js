// ************************************ App Config ******************************

const express = require('express');
const app = express();
const port = 3000;
var MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb+srv://FM93:Liliyomgol6871@cluster0.w5kk9.mongodb.net/Storydb?retryWrites=true&w=majority';
// var url = "mongodb://localhost:27017/";


// ************************************ App Config ******************************

app.set('view engine', 'ejs');

app.use(express.static('public'));
// This tells our application that if it cannot find a file then look for it in the public directory.

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ******************************************* Routes *****************************

app.get('/', (req, res) => {
    res.render('start-page.ejs');

});



app.post('/question', (req, res) => {

    var id = req.body.q_id;

    if (id == "null") {

        var parent_id = null;

        GetDataByParentId(parent_id).then(parent_result => {

            GetDataByParentId(parent_result[0].id).then(children_result => {


                res.render('main-page.ejs', {
                    data: {
                        question: parent_result[0],
                        children: children_result
                    }
                });

            })

        })
    } else {

        var node_id = parseInt(id);

        GetDataByParentId(node_id).then(children_result => {

            res.render('main-page.ejs', {
                data: {
                    question: {
                        id: req.body.q_id,
                        context: req.body.q_context,
                        image: req.body.q_image,
                        audio: req.body.q_audio
                    },
                    children: children_result
                }
            });

        })
    }

});


// ********************************** Calling The Server *****************************

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


// ****************************************  Functions  *******************************

function SaveInitalData() {
    var myobj = [{
            id: 0,
            context: 'What do you do first when you wake up?',
            parent_id: null,
            is_question: true
        },
        {
            id: 1,
            context: 'I drink a coffee',
            parent_id: 0,
            is_question: false
        },
        {
            id: 2,
            context: 'I go out to work soon',
            parent_id: 0,
            is_question: false
        },
        {
            id: 3,
            context: 'I check my phone',
            parent_id: 0,
            is_question: false
        },
        {
            id: 4,
            context: 'Coffee machine does not work, what do you do?',
            parent_id: 1,
            is_question: true
        }
    ];


    MongoClient.connect(dbUrl, {
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) return console.error(err);
        const db = client.db('Storydb');
        const collection = db.collection('steps');

        collection
            .insertMany(myobj, function (err, res) {
                if (err) throw err;
                //console.log("Number of documents inserted: " + res.insertedCount);
            });
    });

}

async function GetDataByParentId(id) {

    try {
        let con = await MongoClient.connect(dbUrl)

        const db = con.db('Storydb');
        const collection = db.collection('steps');
        const p = await collection.find({
            parent_id: id
        }).toArray();

        return p;

    } catch (err) {
        throw err;
    }

}

function Update() {

    MongoClient.connect(dbUrl, {
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) return console.error(err);
        const db = client.db('Storydb');
        const collection = db.collection('steps');

        collection
            .updateOne({
                "parent_id": null
            }, {
                $set: {
                    "is_question": true
                }
            });
    });
}

function Delete() {

    MongoClient.connect(dbUrl, {
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) return console.error(err);
        const db = client.db('Storydb');
        const collection = db.collection('steps');

        collection
            .deleteOne({
                "id": 3
            });
    });
}