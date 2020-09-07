const express=require('express');
const path =require('path')
const app=express();


//Serving static files
app.use(express.static(path.join(__dirname,'public')));
//Setting up the view engine to be ejs
app.set('view engine','ejs')


//Middlewares
app.post('/',(req,res)=>{
    res.statusCode=200;
    res.render('show')
})









//Listening to the server
const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`Listening to the server at ${PORT}`)
})

// --------------------------------