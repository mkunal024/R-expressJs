const express=require("express")
const app=express();
const bodyparser=require("body-parser");
const router=require('./router/router.js')
const path = require('path'); 
const ejsMate = require('ejs-mate');

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyparser.json())
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/",router)

app.listen(3002,function(){
    console.log("server is running at port 3002")

})

module.exports=app;
