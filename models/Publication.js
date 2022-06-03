const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = new Schema({

    //main infomation
    title: {
        type: String,
        required: true
    },
    authorID: {
        type: ObjectId,
        required: true
    },
    desc: {
        type: String,
        required: true
    },


    //TODO link infomation -- thumbnail? where to buy? download link? 
    thumbnailLink:{
        type: String,
        required: true
    },
    downloadLink:{
        type: String,
        required: true
    },

    //TODO publication infomation
    isbn: {
        type : String,
        required : true
    },
    publicationDate: {
        type: Date,
        required: true
    },
    noPages: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    originalLanguage: {
        type: String,
        required : true
    },
    format: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    downloads: {
        type: Number,
        required: true
    }







});

module.exports = Publication = mongoose.model("Publication", PublicationSchema)