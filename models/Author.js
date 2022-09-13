const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    otherNames: {
        type:String,
        required: true
    },

    info: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = Author = mongoose.model("Author", AuthorSchema)