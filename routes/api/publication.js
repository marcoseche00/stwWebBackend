const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const Publication = require('../../models/Publication');
const Author = require('../../models/Author');

router.get('/get-all', (req,res) => {
    console.log("get all.....");
    Publication.find().then(publications => res.json(publications));
    
});
router.get('/get-first-five', (req,res) => {
    console.log("get all.....");
    Publication.find().limit(5).then(publications => res.json(publications));
    
});
router.get('/get-first-five-most-downloads', (req,res) => {
    console.log("get all.....");
    Publication.find().sort({"downloads":-1}).limit(5).then(publications => res.json(publications));
    
});
router.get('/get/:id', (req,res) => {
    console.log("get one.....");
    Publication.find({_id:req.params.id}).then(publications => res.json(publications));
    
});

//using a post request just so i can req.body
//function to get the books may have search queries
//may be sorted by some value
//limit result size 
//may have a page number
var levenshtein = require('fast-levenshtein');

router.post('/get-books-query', async (req,res) => {
    
    const search = req.body.search_query;
    const page_number = req.body.page_number
    const sort_by = req.body.sort_by;
    const sort_direction = req.body.sort_direction
    console.log("book query: ", search);

    //get all the values from the publication, only get the first (50 books per page) * (page_number)*2
    const numBooks = 50 * page_number * 2;
    var booksUnfiltered = await Publication.find().then(publications => {
        return publications;
    });

    //make a new array, within some limit of the levenshtein distance if searh query != null
    //only add to the new array if greater than some threshhold
    var booksArrayWithDistance = [];
    
    for (i = 0; i< booksUnfiltered.length; i++ ){
        const bookname = booksUnfiltered[i].title
        console.log(bookname);
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

    console.log("books filtered: ",booksArrayWithDistance)
    if (search != null){
           //sort by search
           res.json(booksArrayWithDistance.sort((a, b) => (a.levenshtein > b.levenshtein) ? 1 : -1).slice(page_number-1,50*page_number));
           return;
    }

    //if not searching then continue with old array
    if (search === null){
        if (sort_by === 'relevance'){
            res.json(booksArrayWithDistance);
            return;
        }
        if (sort_by === 'upload_date'){
            res.json(booksArrayWithDistance.sort((a, b) => (a.publicationDate > b.publicationDate) ? 1 : -1).slice(page_number-1,50*page_number));
           return;
        }
        if (sort_by === 'price'){
            res.json(booksArrayWithDistance.sort((a, b) => (a.price > b.price) ? 1 : -1).slice(page_number-1,50*page_number));
           return;
        }
    }

    

});

router.post('/increment-downloads',(req,res) => {
    console.log("incrementing downloads: ",req.body.id);
    Publication.findByIdAndUpdate({_id : req.body.id}, {$inc: {'downloads': 1}}).then(publications => {
        console.log("new publication ",publications)
        res.json(publications)}
        );
})
router.post('/create', async(req,res) => {
    
    
    console.log("attempting to post new publication to db ... \n");
    //book and author info
    const title = "testbook7";
    const authorFirstName = "testAuthor7";
    const authorOtherName = "testAuthorSecondName7";
    const authorInfo = "this is author info7: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat faucibus ex in sollicitudin. Vestibulum bibendum iaculis est ut suscipit. Phasellus nisl odio, tincidunt ac mattis in, fringilla et nisi. Pellentesque aliquam, leo eget sodales imperdiet, mi libero aliquam enim, sit amet molestie justo metus et sapien. Proin scelerisque nec leo vitae tristique. Pellentesque sodales nisi imperdiet, semper metus eu, tempus nisl. Maecenas orci turpis, porta et nisl id, vestibulum aliquam justo. Nullam tempor luctus lectus non hendrerit. Curabitur id nulla aliquam, sodales nulla in, maximus neque. Sed vitae efficitur ex, sit amet ornare orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in ex ut nulla semper molestie eget ut est. Aenean eget massa nec lorem consectetur rhoncus vel ut nunc."
    const imageLink = "/files/authors/thumbnails/placeholder.jpeg"
    const description = "this is description7:Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat faucibus ex in sollicitudin. Vestibulum bibendum iaculis est ut suscipit. Phasellus nisl odio, tincidunt ac mattis in, fringilla et nisi. Pellentesque aliquam, leo eget sodales imperdiet, mi libero aliquam enim, sit amet molestie justo metus et sapien. Proin scelerisque nec leo vitae tristique. Pellentesque sodales nisi imperdiet, semper metus eu, tempus nisl. Maecenas orci turpis, porta et nisl id, vestibulum aliquam justo. Nullam tempor luctus lectus non hendrerit. Curabitur id nulla aliquam, sodales nulla in, maximus neque. Sed vitae efficitur ex, sit amet ornare orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in ex ut nulla semper molestie eget ut est. Aenean eget massa nec lorem consectetur rhoncus vel ut nunc.";

    const thumbnailLink = "/";
    const downloadLink = "/";
    const isbn =  "this is the isbn";
    const publicationDate= "01/01/2022";
    const noPages = 100;
    const language = "english";
    const originalLanguage = "english";
    const format = "pdf";
    const price = 0;
    const downloads = 0


    //if author exists then add book and author id 
    //esle create new author post then add book and author id
    //look for author 

    const authorResp = await Author.find({firstName: authorFirstName, otherNames: authorOtherName}).limit(1);
    //also check valid email adress
    if ((authorResp.length === 0)) {
        //create new author
        console.log("author doesnt exist posting new author");

        const newAuthor = new Author({
            firstName: authorFirstName,
            otherNames: authorOtherName,
            info: authorInfo,
            image: imageLink
        });

        await newAuthor.save();


        //get the id
        const authorResp = await Author.find({firstName: authorFirstName, otherNames: authorOtherName}).limit(1);
        console.log(authorResp);
     

        const authorID = authorResp[0]._id
        console.log("id: ",authorResp[0]._id);
        
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
            downloads: 0,
   
        });
        console.log("1");

        await newPublication.save().then(publications => res.json(publications));
        console.log("2");
        console.log("posted..\n");

        
    }
    else{
        //check if book already exists 
        console.log("author exists posting new book with author id");
        const publicationResp = await Publication.find({title: title}).limit(1);
        if (publicationResp.length === 0){

            //get author id
            console.log(authorResp);
            const authorID = authorResp[0]._id;
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
    
            });

            await newPublication.save().then(publications => res.json(publications));

            console.log("posted..\n");

            

        }else{
            //book already exists
            console.log("book already exists under this author");
        }
    }
    res.send().end();
}); 

module.exports = router;