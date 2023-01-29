const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const EmailSubscription = require('../../models/EmailSubscription');


router.get('/get-email-subcriptions', (req,res) => {
    console.log("emailSubscription/get-email-subscriptions... ");
    return EmailSubscription.find().then(emailSubscriptions => res.json(emailSubscriptions));
});

router.post('/create-new-email-subscription/:user_email', async(req,res) => {
    
    
    console.log("emailSubscription/create-new-email-subscription...");
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

const { spawn } = require('child_process');

router.post('/contact-us', async(req,res) => {
    console.log("contact us...")
    var user_email = req.body.email.toLowerCase();
    var user_message = req.body.message;
    var user_name = req.body.name;

    if (user_email == "" || user_message == "" || user_name == "") {
        return res.status(400).send({
            message: "Email, Message or Name cannot be empty!"
        });
    }

    // run a python script to send the email
 
    const pyProg = spawn('python', ['../stwWebBackend/scripts/contactUsEmail.py', user_name, user_email, user_message]);

    pyProg.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...', data.toString());
        dataToSend = data.toString();
    });
    res.status(200).send("hey");

    pyProg.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
    });


});

module.exports = router;