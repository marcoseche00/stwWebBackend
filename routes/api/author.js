const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const Author = require('../../models/Author');
const Publication = require('../../models/Publication');
const mongoose = require('mongoose');

router.get('/get-authors/:id', (req,res) => {
    console.log("author/get-authors... id = ", req.params.id , !req.params.id);
    if (req.params.id && mongoose.Types.ObjectId.isValid(req.params.id) ){
        return Author.find({_id:req.params.id}).then(authors =>  res.json(authors));
    } else {
        console.log("error authorID undefined");
        return res.status(400).send({
            message: "id undefined"
        });
    }
    
});

router.get('/get-all', (req,res) => {
    console.log("author/get all...");
    return Author.find().then(Authors => res.json(Authors));
});

//route to create

router.post('/create-new-author', async(req,res) => {
    
    
    console.log("author/create-new-author... ");
    console.log("check image: ", req.body.image);
    //check if unique
    const response = await Author.find({firstName: req.body.firstName, otherNames: req.body.otherNames}).limit(1);
    //also check valid email adress
    if ((response.length === 0)) {
        
        console.log("author/create-new-author: posting to the db...");
        
        const newAuthur = new Author({
            firstName: req.body.firstName,
            otherNames: req.body.otherNames ,
            info: req.body.info,
            image: req.body.image,
        });

        return newAuthur.save().then(Authors => res.json(Authors));

        
    }
    else{
        console.log("author/create-new-author: failed, author already in the db");
        return res.status(400).send({
            message: "failed, author already in the db"
        });
    }
}); 


//route to upload
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/authors/thumbnails');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname )    }
});
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
        || file.mimetype === 'image/jpeg'){
            cb(null, true);
        }else {
            cb(null, false);
        }
}

const upload = multer({storage: storage, fileFilter: filefilter});
const SingleFile = require('../../models/singlefile');

const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}

const singleFileUpload = async (req, res, next) => {
    try{
        console.log("file: ", req.file)
        const file = new SingleFile({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
        });

        await file.save().then(fileName => {
            console.log("filename: ",fileName ) ;
            res.status(201).send(fileName);
        });

    }catch(error) {
        res.status(400).send(error.message);
    }
}


router.post('/upload', upload.single("file") , singleFileUpload);



// route to delete
var fs = require('fs');

router.post("/delete", async(req,res) => {
    console.log ("deleting authorID: ", req.body.id)
    //check the publications for any documents that have that author
    //if none then safely delete 
    const publications = await Publication.find({authorID: req.body.id});
    if (publications.length === 0) {
        console.log("deleting");

        //delete image 
        fs.stat(req.body.image_path, function (err, stats) {
            console.log(stats);//here we got all information of file in stats variable
         
            if (err) {
                return console.error(err);
            }
         
            fs.unlink(req.body.image_path,function(err){
                 if(err) return console.log(err);
                 console.log('file deleted successfully');
            });  
         })


        //delete record

        Author.findByIdAndDelete(req.body.id, (err, docs) => {
            if (err){
                console.log(err)
            }
            else{
                console.log("Deleted : ", docs);
                res.status(200).send();
            }
        });
    }
    else {
        console.log("failed, authorID present in publications");
        return res.status(400).send({
            message: "failed, authorID present in publications"
        });
    }
    //else throw an error saying that publications exist with author
});
module.exports = router;