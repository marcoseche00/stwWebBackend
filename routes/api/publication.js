const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const Publication = require('../../models/Publication');
const Author = require('../../models/Author');

router.get('/get-all', (req,res) => {
    console.log("publication/get-all...");
    return Publication.find().then(publications => res.json(publications));
    
});
router.get('/get-first-five', (req,res) => {
    console.log("publication/get-first-five...");
    return Publication.find().limit(5).then(publications => res.json(publications));
    
});
router.get('/get-first-five-most-downloads', (req,res) => {
    console.log("publication/get-first-five-most-downloaded...");
    return Publication.find().sort({"downloads":-1}).limit(5).then(publications => res.json(publications));
    
});
router.get('/get/:id', (req,res) => {
    console.log("get...");
    if (req.params.id){
        Publication.find({_id:req.params.id}).then(publications => res.json(publications));
    } else {
        return res.status(400).send({
            message: "error: id undefined"
        });
    }
    
});

//using a post request just so i can req.body
//function to get the books may have search queries
//may be sorted by some value
//limit result size 
//may have a page number
var levenshtein = require('fast-levenshtein');

router.post('/get-books-query', async (req,res) => {
    console.log("publication/get-book-query...")
    const search = req.body.search_query;
    const page_number = req.body.page_number
    const sort_by = req.body.sort_by;
    const sort_direction = req.body.sort_direction

    //get all the values from the publication, only get the first (50 books per page) * (page_number)*2
    const numBooks = 50 * page_number * 2;
    var booksUnfiltered = await Publication.find().then(publications => {
        return publications;
    });

    //make a new array, within some limit of the levenshtein distance if searh query != null
    //only add to the new array if greater than some threshhold
    var booksArrayWithDistance = [];
    if (search){
        for (i = 0; i< booksUnfiltered.length; i++ ){
            const bookname = booksUnfiltered[i].title
            booksArrayWithDistance.push({
                _id: booksUnfiltered[i]._id,
                title:booksUnfiltered[i].title,
                authorID: booksUnfiltered[i].authorID,
                desc: booksUnfiltered[i].desc,
                thumbnailLink: booksUnfiltered[i].thumbnailLink,
                downloadLink: booksUnfiltered[i].downloadLink,
                isbn: booksUnfiltered[i].isbn,
                publicationDate: booksUnfiltered[i].publicationDate,
                noPages: booksUnfiltered[i].noPages,
                language: booksUnfiltered[i].language,
                originalLanguage: booksUnfiltered[i].originalLanguage,
                format: booksUnfiltered[i].format,
                price: booksUnfiltered[i].price,
                __v: booksUnfiltered[i].__v,
                downloads: booksUnfiltered[i].downloads,
                levenshtein: levenshtein.get(search,bookname),
            })
        }
    }

    if (search){
           //sort by search
           return res.json(booksArrayWithDistance.sort((a, b) => (a.levenshtein > b.levenshtein) ? 1 : -1).slice(page_number-1,50*page_number));     
        }

    //if not searching then continue with old array
    else {
        if (sort_by === 'relevance'){
            return res.json(booksUnfiltered);
        }
        if (sort_by === 'upload_date'){
            return res.json(booksUnfiltered.sort((a, b) => (a.publicationDate > b.publicationDate) ? 1 : -1).slice(page_number-1,50*page_number));
        }
        if (sort_by === 'price'){
            return res.json(booksUnfiltered.sort((a, b) => (a.price > b.price) ? 1 : -1).slice(page_number-1,50*page_number));
        }
        else {
            return res.json(booksUnfiltered);
        }
    }
});

router.post('/increment-downloads',(req,res) => {
    console.log("publication/incrementing-downloads: ",req.body.id);
    if (req.body.id) {
        return Publication.findByIdAndUpdate({_id : req.body.id}, {$inc: {'downloads': 1}}).then(publications => {
            res.json(publications)}
            );
    }else {
        return res.status(400).send({
            message: "error id undefined"
        });
    }
})
router.post('/create', async(req,res) => {
    
    
    console.log("publication/create... ");
    //book and author info
    const title = req.body.title
    const authorID = "6345f84e7a755ff0bc8717e1"
    const description = req.body.desc
    const thumbnailLink = req.body.thumbnailLink
    const downloadLink = req.body.downloadLink
    const isbn =  req.body.isbn
    const publicationDate= req.body.publicationDate
    const noPages = req.body.noPages
    const language = req.body.language
    const originalLanguage = req.body.originalLanguage
    const format = req.body.format
    const price = req.body.price
    const downloads = 0


    
    
    const publicationResp = await Publication.find({title: title}).limit(1);
    if (publicationResp.length === 0){

        //create new book
        const newPublication = new Publication({
            title:title,
            authorID: authorID,
            desc: description,
            thumbnailLink: thumbnailLink,
            downloadLink: downloadLink,
            isbn: isbn,
            publicationDate: publicationDate,
            noPages:noPages,
            language:language,
            originalLanguage:originalLanguage,
            format:format,
            price:price,
            downloads: 0

        });

        return newPublication.save().then(publications => res.json(publications));

    }else{
        console.log("bookname already exists under this author");
        return res.status(400).send({
            message: "bookname already exists under this author"
        });
    }

}); 


//route to delete 
var fs = require('fs');

router.post('/delete',async(req,res) => {
     //delete thumbnail 
     fs.stat(req.body.thumbnail_path, function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable
     
        if (err) {
            return console.error(err);
        }
     
        fs.unlink(req.body.thumbnail_path,function(err){
             if(err) return console.log(err);
             console.log('file deleted successfully');
        });  
     })

     //delete book
     fs.stat(req.body.book_path, function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable
     
        if (err) {
            return console.error(err);
        }
     
        fs.unlink(req.body.book_path,function(err){
             if(err) return console.log(err);
             console.log('file deleted successfully');
        });  
     })


    //delete record

    Publication.findByIdAndDelete(req.body.id, (err, docs) => {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted : ", docs);
            res.status(200).send();
        }
    });
})

//route to upload
const multer = require('multer');

const storageThumbnail = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/publications/thumbnails');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname )    }
});
const storageBook = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/publications/PDF');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname )    }
});

const filefilterImage = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
        || file.mimetype === 'image/jpeg'){
            cb(null, true);
        }else {
            cb(null, false);
        }
}
const filefilterBook = (req, file, cb) => {
    if (file.mimetype === 'application/pdf'){
            cb(null, true);
        }else {
            cb(null, false);
        }
}

const uploadThumbnail = multer({storage: storageThumbnail, fileFilter: filefilterImage});
const uploadBook = multer({storage: storageBook, fileFilter: filefilterBook});
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
    console.log("publication/upload-*: Uploading file ... ")
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
        console.log("error uploading item")
        res.status(400).send(error.message);
    }
}


router.post('/upload-image', uploadThumbnail.single("file") , singleFileUpload);

router.post('/upload-book', uploadBook.single("file") , singleFileUpload);



module.exports = router;