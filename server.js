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



app.get('/question', (req, res) => {

    GetData(res, 'main-page.ejs', null);

    // res.render('main-page.ejs', {
    //     data: {
    //         //questionObj: questionObj,
    //         // optionObjArray: optionObjArray
    //     }
    // });

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

function GetData(res, page, parent_id) {

    MongoClient.connect(dbUrl, (err, client) => {

        if (err) return console.error(err);

        const db = client.db('Storydb');
        const collection = db.collection('steps');
        collection.find({
                parent_id: parent_id
            })

            .toArray()
            .then((results) => {
                res.render(page, {
                    stepsObj: results
                });

            })
            .catch((error) => {
                res.redirect('/');
            });



        // .toArray((err, results) => {
        //     if (err) throw err;

        //     // result = results;
        //     // console.log(result[0]);
        //     // results.forEach((value) => {
        //     //     //console.log(value.context);
        //     //     result.push(value)
        //     // });


        // });

    })
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