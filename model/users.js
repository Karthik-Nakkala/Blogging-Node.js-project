const {createTokenForUser}=require('../services/authentication');

const {createHmac,randomBytes} = require('crypto');

const {Schema,model}=require('mongoose');

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
         type:String,
    },
    password:{
         type:String,
         required:true,
    },
    profileImageUrl:{
         type:String,
         default:'/images/user-avatar.png',
    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User",
    },
},
{timestamps:true}
);

userSchema.pre('save',function(next){
    const user=this; //now 'user' will ponts towards current user object
    if(!user.isModified('password')){
        return;
    }
    const salt=randomBytes(16).toString();

    const hashPassword=createHmac('sha256',salt).update(user.password).digest('hex');
    //by this, in DB i will not store users password directly, insted i will store his password in encryppted way by hashing it
    this.salt=salt;
    this.password=hashPassword;

})

userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    const user=await this.findOne({email});
    if(!user){
        throw new Error("User Not Found!");
    }
    const salt=user.salt;
    const hashedPassword=user.password;

    const userGivenHashPassword=createHmac('sha256',salt).update(password).digest('hex');

    if(userGivenHashPassword !== hashedPassword){
        throw new Error("Incorrect Password!");
    }

    const token=createTokenForUser(user);
    return token;
})

const User=model('user',userSchema);

module.exports=User;