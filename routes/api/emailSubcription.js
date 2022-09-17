const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const EmailSubscription = require('../../models/EmailSubscription');


router.get('/get-email-subcriptions', (req,res) => {
    console.log("emailSupscription/get-email-subscriptions... ");
    return EmailSubscription.find().then(emailSubscriptions => res.json(emailSubscriptions));
});

router.post('/create-new-email-subscription/:user_email', async(req,res) => {
    
    
    console.log("emailSupscription/create-new-email-subscription...");
    var user_email = req.params.user_email.toLowerCase();

    //check if unique
    const response = await EmailSubscription.find({email: user_email}).limit(1);
    //also check valid email adress
    if ((response.length === 0) && (validator.validate(user_email))) {
        
        console.log("emailSupscription/create-new-email-subscription: posting to the db... ");
        
        const newEmailSubscription = new EmailSubscription({
            email: user_email
        });
        return newEmailSubscription.save().then(emailSubscriptions => res.json(emailSubscriptions));
        
    }
    else{
        console.log("emailSupscription/create-new-email-subscription: failed, email already in the db or email invalid");
        return res.status(400).send({
            message: "failed, email already in the db or email invalid"
        });
    }
}); 

module.exports = router;