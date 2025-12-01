const {Router}=require('express');

const multer=require('multer');

const path=require('path');

const Blog=require('../model/blogs');

const Comment=require('../model/comments');

const blogRouter=Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`
    cb(null, uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

blogRouter.get('/add-new',(req,res)=>{
    res.render('blogs.ejs',{
        user:req.user
    });
});

blogRouter.post('/',upload.single('coverImage'),async (req,res)=>{
   const {title,body}=req.body;
   const blog=await Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,
   })
   res.redirect('/');
});

blogRouter.get('/:id',async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const comments=await Comment.find({blogId:req.params.id}).populate("createdBy");
    console.log(comments);
    res.render('blog',{
        user:req.user,
        blog,
        comments,
    })
})

blogRouter.post('/comment/:blogId',async (req,res)=>{
    const comments=await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports=blogRouter;