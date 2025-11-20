import jwt from "jsonwebtoken"

const generateToken=(user)=>{
    return jwt.sign(
        {id:user._id, roles: user.roles.map(r => r.trim())},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN}
    )
}

export{
    generateToken
}