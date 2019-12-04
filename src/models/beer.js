const mongoose = require('mongoose');

//Credentials of data that will be stored in MongoDB

const BeerSchema = new mongoose.Schema({
    beerId: {
        beerId: mongoose.Schema.Types.ObjectId,
        content: String
    },
    storeName: {
        type: String,
        default: ''
    },
    beerName: {
        type: String,
        default: ''
    },
    beerType: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    //isDeleted is needed to see if the user is signed out and if it is a valid session
    state: {
        type: String,
        default: ''
    }

});

const Beer = mongoose.model('Beer', BeerSchema);
module.exports = Beer;