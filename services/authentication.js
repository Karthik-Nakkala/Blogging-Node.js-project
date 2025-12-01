const JWT=require('jsonwebtoken');

const secret="India'$_Bigge$t$uper$tar";

function createTokenForUser(user){
    const payLoad={
        _id:user._id,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role,
    }
    const token=JWT.sign(payLoad,secret);
    return token;
}

function validateToken(token){
    const payLoad=JWT.verify(token,secret);
    return payLoad;
}

module.exports={
    createTokenForUser,
    validateToken,
}

