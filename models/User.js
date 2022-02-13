const mongoose = require('mongoose')

const UserScheme = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {unique: true}
    },
    credentials: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", UserScheme);