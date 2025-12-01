const {Router}=require('express');

const User=require('../model/users');

const router=Router();

router.get('/signup',(req,res)=>{
    res.render('signup');
})
router.get('/signin',(req,res)=>{
    
    res.render('signin');
})

router.post('/signup',async (req,res)=>{
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    })
    res.redirect('/');
});

router.post('/signin',async(req,res)=>{
    
     const {email,password}=req.body;
     try{
        const token=await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect('/');
    }catch(err){
        return res.render('signin',{
            error:`${err}`,
        });
    }
});

router.get('/logout',(req,res)=>{
    
    res.clearCookie("token").redirect('/user/signin');
});

module.exports=router;