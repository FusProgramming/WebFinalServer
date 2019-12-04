const express = require('express');
const router = express.Router();
const Beer = require('../../models/beer');


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

module.exports = router;
