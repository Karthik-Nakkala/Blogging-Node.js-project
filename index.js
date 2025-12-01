const mongoose=require('mongoose');

const ejs=require('ejs')

const express=require('express');

const path=require('path');
const Blog=require('./model/blogs');

const userRouter=require('./routes/user');
const blogRouter=require('./routes/blogs');

const cookieParser=require('cookie-parser');
const {checkforAuthenticationCookie}=require('./middlewares/authentication');

const app=express();

const PORT=8001;

mongoose.connect('mongodb://localhost:27017/blogify').then(e=>{
    console.log('MongoDB Connected');
})

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkforAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));


app.use('/user',userRouter);
app.use('/blog',blogRouter);

app.get('/',async (req,res)=>{
    const allBlogs=await Blog.find({});
    console.log(req.user);
    res.render('home.ejs',{
        user: req.user,
        
        blogs:allBlogs,
    });
})




app.listen(PORT,()=>{
    console.log(`server serving from the port: ${PORT}`)
})