// [middleware is a function given in the between of route and callback and it takes 3 argument req,res,next => next is the callback in that route]
const jwt = require('jsonwebtoken');
const JWT_SECRET = '@myFirstCRUDWeb';//accessing our JWT_SECRET for verifying the token and getting the user
const fetchuser = (req,res,next)=>{
    try{
        const token = req.header('auth-token');
        if(!token){
            return res.status(401).send('Please Enter a valid token');
        }else{
            const data = jwt.verify(token,JWT_SECRET);
            req.user = data;
            next();
        }
    }catch(err){
        console.error(err);
        return res.status(401).send('Please Enter a valid token');
    }
}
module.exports = fetchuser;