const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailSubscriptionSchema = new Schema({
    email: {
        type: String,
        required: true
    },



});

module.exports = EmailSubscription = mongoose.model("EmailSubscription", EmailSubscriptionSchema)