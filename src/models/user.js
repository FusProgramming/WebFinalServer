const mongoose = require('mongoose');

//Credentials of data that will be stored in MongoDB
const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    emailAddress: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    //isDeleted is needed to see if the user is signed out and if it is a valid session
    isDeleted: {
        type: Boolean,
        default: false
    }

});

const User = mongoose.model('User', UserSchema);
module.exports = User;