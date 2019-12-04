
const Express = require('express');
const Mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Beer = require('./models/beer');
const Post = require('./models/registerpost');
const app = Express();

const uri = "mongodb://localhost:27018/test";
// Connect to the 'test' database. Ensure you have started the mongod process!
Mongoose.connect(uri , {useNewUrlParser: true});
// When Mongoose has connected to your MongoDB, print out a log message
Mongoose.connection.once('open', () => console.log("Connected to database!"));

// We will use an Express Middleware called json. Middleware is called before any REST route gets your request.
// Middleware can reject requests prior to reaching your REST routes or append data to your route.
// The Express.json middleware provides easy to use JSON on POST requests.
// Specify where the compiled React app lives (copied the files manually from the client build)
const clientAppDirectory = path.join(__dirname, '../public', 'build');
app.use(Express.static(clientAppDirectory));
// When a GET request comes in on this route, find all users in the database and return them with a 200 code

app.post('/api/postly', (request, response) => {
    console.log('Received request: ' + JSON.stringify(request.body));
    const { testData } = request.body;
    // If the data is a string called 'teapot', return the teapot status code
    if (testData === 'teapot') {
        return response.sendStatus(418);
    }
    // Simply return whatever the client sent to show that the server received it
    return response.status(200)
        .send('You said ' + testData);
});

// Any other GET request that doesn't match previous routes should return the website
app.get('/*', (request, response) => {
    const indexPath = path.join(clientAppDirectory, 'index.html');
    return response.sendFile(indexPath);
});
app.use(Express.json());
app.get('/api/user', async (request, response) => {

    console.log('A GET request came in asking for all users');

    const users = await User.find({});

    return response.send(users).status(200);
});

// When a POST request comes in on this route, create a new user and return success with a 200 code or failure with a 400 code
app.post('/api/users', async (request, response) => {
    console.log('A request came in with the body: ' + JSON.stringify(request.body));
    const { userName, firstName, lastName, emailAddress, password} = request.body;
    try {
        const existingUser = await User.findOne({ emailAddress: { $eq: emailAddress}});
        if(existingUser) {
            console.log(`A user with the email address '${emailAddress}' already exists, rejecting request with a 400`);
            return response.sendStatus(400);
        }

        await bcrypt.hash(password, 12, async (error, hash) => {
            if (error) {
                console.log('An error occured hashing the password: ' + error.message);
                return response.sendStatus(400);
            }
            // Create a new user with the password hash and email address
            const user = await User.create({userName, firstName, lastName, emailAddress, password: hash});
            console.log('Saved user email was ' + user.emailAddress + ' and password was ' + user.password);
            return response.sendStatus(200);
        });

        console.log(`A new user was created with name: '${userName}' and email address: '${emailAddress}'`);
        return response.sendStatus(200);
    } catch (error) {
        console.error('Something went wrong while creating a new user: ' + error.message);
        return response.sendStatus(400);
    }
});

//----------------------------------------------------------------------------------------------------------------------
app.get('/api/beer', async (request, response) => {
    console.log('A GET request came in asking for all users');
    const beers = await Beer.find({});
    return response.send(beers).status(200);
});

// When a POST request comes in on this route, create a new user and return success with a 200 code or failure with a 400 code
app.post('/api/beers', async (request, response) => {

    console.log('A request came in with the body: ' + JSON.stringify(request.body));
    const { storeName, beerName, beerType, address, city, state} = request.body;
    try {
        await Beer.create({
            storeName: storeName,
            beerName: beerName,
            beerType: beerType,
            address: address,
            city: city,
            state: state
        });

        console.log(`A new user was created with name: '${storeName}' and email address: '${beerName}'`);
        return response.sendStatus(200);

    } catch (error) {
        console.error('Something went wrong while creating a new user: ' + error.message);
        return response.sendStatus(400);
    }
});

app.delete('/api/beer/', async (request, response) => {
    const { beerId, storeName, beerName, beerType, address, city, state} = request.body;
    try {

        console.log('Delete Request');
        const beers = await Beer.deleteOne({});

        return response.send(beers).status(200);
    } catch (error) {
        console.error('Something went wrong while trying to delete: ' + error.message);
        return response.sendStatus(400);
    }
});



const port = process.env.PORT || 4300;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));