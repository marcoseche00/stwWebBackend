const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const News = require('../../models/News');
const mongoose = require('mongoose');

router.get('/get-all', (req,res) => {
    console.log("news/get-all...");
    return News.find().then(Newss => res.json(Newss));
    
});
router.get('/get-first-five', (req,res) => {
    console.log("news/get-first-five...");
    return News.find().limit(5).then(Newss => res.json(Newss));
    
});

router.get('/get/:id', (req,res) => {
    console.log("news/get...");
    if (req.params.id  && mongoose.Types.ObjectId.isValid(req.params.id)){
        return News.find({_id:req.params.id}).then(News => res.json(Newss));
    }else {
        return res.status(400).send({
            message: "error news id undefined"
        });
    }
    
});


router.post('/create', (req,res) => {
    console.log("news/create...")

    //news Data manually set atm
    const title = "test5";
    const imagePath = "/files/authors/thumbnails/placeholder.jpeg";
    const date = "22 May 2022"
    const desc = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur"
    
    //create new book
    const newNews = new News({
        title:title,
        image: imagePath,
        date: date,
        description: desc,

    });


    return newNews.save().then(newss => res.json(newss));
    
}); 

module.exports = router;