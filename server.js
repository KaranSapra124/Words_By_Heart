const express = require('express');
const BodyParser = require('body-parser');
const http = require('http')
const app = express()
const server = http.createServer(app)
const ejs = require('ejs');
const mongoose = require('mongoose')
const md5 = require('md5')
const {Server} = require("socket.io");
const io = new Server(server)
const path = require('path')
// var Name = req.body.Myname;

mongoose.set("strictQuery",true)
mongoose.connect("mongodb+srv://Bakchod:Iamphenomenol1@cluster0.qmqhyta.mongodb.net/?retryWrites=true&w=majority")

app.use(BodyParser.urlencoded({extended:true}))
// const { connected } = require('process');
app.use(express.static('public'))


const newuser = new mongoose.Schema({
    Name:{type:String},
    PhoneNum:{type:Number},
    Password:{type:String}
})

const user = mongoose.model("user",newuser)


app.set('view engine','ejs');




app.get('/',(req,res)=>{
   res.render('Login')
})

app.get('/Login',(req,res)=>{
    res.render('Login')
})

app.post('/Login',(req,res)=>{
    var Username = req.body.Username;
    var Userpassword = md5(md5(req.body.Userpassword))
    user.find({Name:Username})
    .then((docs)=>{
        // console.log(docs);
        if(docs[0].Password == Userpassword){
            // console.log("User Matched");
            res.render('index',{Data:docs})
        }
    })
    .catch((err)=>{
        console.log("Error");
    })
})

app.get('/Signup',(req,res)=>{
    res.render("Signup")
})

app.post('/Signup',(req,res)=>{
    console.log(req.body.Name);
    const Nayauser = new user ({
        Name:req.body.Username,
        PhoneNum:req.body.Usernum,
        Password:md5(md5(req.body.UserPassword)),
    })
    console.log("Signed Up");
    Nayauser.save()
    res.redirect('/Login')
})

io.on('connection',(socket)=>{
    // console.log("A user is connected");
    socket.on('chat message', (msg) => {
        io.emit('chat message' , msg)
      });
})

server.listen(3000,()=>{
    console.log("Running on 3000");
})
