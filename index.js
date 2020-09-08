const express=require('express');
const path =require('path')
const app=express();
const mysql=require('mysql')
const bodyParser=require('body-parser')
const fileUpload=require('express-fileupload')

//Connecting to the database
var connection=mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user:'sql12364372',
    password:'hJKpSC43Q3',
    database:'sql12364372'
})
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
    res.statusCode=200;
    let data={Name:req.body.name,
        DOB:req.body.dob,
        Country:req.body.country,
        Bio:req.files.resume
    }
    // console.log(data.Bio);
    let sql='INSERT INTO posts SET ?'
    let query=connection.query(sql, data,(err,result)=>{
        if(err) throw err;
        console.log(result);
    })

    console.log(data.Bio)
    res.redirect('/showdata')
})
//GET '/showdata'
app.get('/showdata',(req,res)=>{
    let sql='SELECT * FROM posts';
    let query=connection.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
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
    let sql=`DELETE FROM posts WHERE Id=${req.params.id}`
    let query=connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.redirect('/showdata')
    })
})









//Listening to the server
const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`Listening to the server at ${PORT}`)
})

// --------------------------------