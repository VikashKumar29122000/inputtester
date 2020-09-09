const express=require('express');
const path =require('path')
const app=express();
const mysql=require('mysql')
const bodyParser=require('body-parser')
const fileUpload=require('express-fileupload')
const fs=require('fs')
const { v4: uuidv4 } =require('uuid');
const { get } = require('https');

//Connecting to the database
var connection=mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user:'sql12364372',
    password:'hJKpSC43Q3',
    database:'sql12364372'
})
// console.log(uuidv4());
connection.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('connected to the database');
})

//Middlewares
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

//Serving static files
app.use(express.static(path.join(__dirname,'public')));

//Setting up the view engine to be ejs
app.set('view engine','ejs')



//routes
// POST '/'
app.post('/',(req,res)=>{
    if(req.files){
        var file=req.files.resume;
        if(file.mimetype!=='application/pdf')
        {
            res.status(500)
            res.json({Message:"PDF file not submitted"})
        }
        else{
            let ID=uuidv4();
            let data={Name:req.body.name,
                DOB:req.body.dob,
                Country:req.body.country,
                BIo:ID
            }
            file.mv(`public/docs/${ID}.pdf`,function(err){
                if(err)
                return res.status(500).send(err);
            })
            let sql='INSERT INTO posts SET ?'
            let query=connection.query(sql, data,(err,result)=>{
                if(err) throw err;
            })
            res.redirect('/showdata')
        }
    }
    else{
        res.status(500).end("no file were uploaded")
    }
})
//GET '/showdata'
app.get('/showdata',(req,res)=>{
    let sql='SELECT * FROM posts';
    let query=connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.render('show',{Data:result})
    })  
})


// sorting data sortByName and sortByDate 
app.get('/showdata/:value',(req,res)=>{
    if(req.params.value==='sortByName')
    {
        let sql='SELECT * FROM posts ORDER BY Name ASC'
        let query=connection.query(sql,(err,result)=>{
            if(err) throw err;
            res.render('show',{Data:result})
        })
    }
    else if(req.params.value==='sortByDate')
    {
        let sql='SELECT * FROM posts ORDER BY Id ASC'
        let query=connection.query(sql,(err,result)=>{
            if(err) throw err;
            res.render('show',{Data:result})
        })
    }
    else{
        res.statusCode=500;
        res.send('Invalid Route')
    }
})
//Delete function
app.get('/delete/:id',(req,res)=>{
    let sql=`DELETE FROM posts WHERE BIo= "${req.params.id}"`;
    let query=connection.query(sql,(err,result)=>{
        if(err) throw err;
        fs.unlink(__dirname+`/public/docs/${req.params.id}.pdf`,(err)=>{
            if(err) throw err;
        })
        
        res.redirect('/showdata')
    })

})


//Listening to the server
const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`Listening to the server at ${PORT}`)
})

// --------------------------------