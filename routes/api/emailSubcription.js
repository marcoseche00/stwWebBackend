const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const EmailSubscription = require('../../models/EmailSubscription');


router.get('/get-email-subscriptions', (req,res) => {
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

var nodeMailer = require('nodemailer');



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

    // send the email
 
  
    var transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'niyamabo@gmail.com',
            pass: 'gswvctxlzhbrcdzg'
        }
    });

    var mailOptions = {
        from: 'niyamabo@gmail.com',
        to: 'librarycatseditorial@gmail.com',
        subject: 'Library Cats Editorial: Contact Us',
        html: ' <p>name: ' + user_name +  '</p> <p>email: '+ user_email +  '<p>message: '+user_message +  '</p>'
    }

    res.status(200).send();

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


});

module.exports = router;