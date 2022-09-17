const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const Author = require('../../models/Author');


router.get('/get-authors/:id', (req,res) => {
    console.log("author/get-authors...");
    if (req.params.id){
        return Author.find({_id:req.params.id}).then(authors =>  res.json(authors));
    } else {
        return res.status(400).send({
            message: "id undefined"
        });
    }
    
});

router.get('/get-all', (req,res) => {
    console.log("author/get all...");
    return Author.find().then(Authors => res.json(Authors));
});


router.post('/create-new-author', async(req,res) => {
    
    
    console.log("author/create-new-author... ");
    //check if unique
    const response = await EmailSubscription.find({email: req.params.user_email}).limit(1);
    //also check valid email adress
    if ((response.length === 0) && (validator.validate(req.params.user_email))) {
        
        console.log("author/create-new-author: posting to the db...");
        
        const newEmailSubscription = new EmailSubscription({
            email: req.params.user_email
        });
        return newEmailSubscription.save().then(emailSubscriptions => res.json(emailSubscriptions));
        
    }
    else{
        console.log("author/create-new-author: failed, author already in the db or email invalid");
        return res.status(400).send({
            message: "failed, author already in the db or email invalid"
        });
    }
}); 

module.exports = router;