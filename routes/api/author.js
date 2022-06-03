const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const Author = require('../../models/Author');


router.get('/get-authors/:id', (req,res) => {
    console.log("getting authors from db...\n");
    console.log("filter: ",req.params.id);
    Author.find({_id:req.params.id}).then(authors =>  res.json(authors));
    
});

router.post('/create-new-author', async(req,res) => {
    
    
    console.log("attempting to post email subscription to db ... \n");
    //check if unique
    const response = await EmailSubscription.find({email: req.params.user_email}).limit(1);
    //also check valid email adress
    if ((response.length === 0) && (validator.validate(req.params.user_email))) {
        
        console.log("posting to the db .... \n");
        
        const newEmailSubscription = new EmailSubscription({
            email: req.params.user_email
        });
        newEmailSubscription.save().then(emailSubscriptions => res.json(emailSubscriptions));
        
    }
    else{
        console.log("failed, email already in the db or email invalid");
    }
}); 

module.exports = router;