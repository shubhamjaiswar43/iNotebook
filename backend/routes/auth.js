const express = require('express');
const router = express.Router();
const User = require('../models/User'); //for creating the user
const bcryptjs = require('bcryptjs'); // for salting and hashing the password
const jwt = require('jsonwebtoken')//for creating a unique userToken for every user for verity them everytime they login 
const JWT_SECRET = '@myFirstCRUDWeb';//signing the jwt using our own select string
const { body, validationResult } = require('express-validator'); //use for checking for given input
const fetchuser = require('../middleware/fetchuser');//importing a middleware of fetching the user using token



//Route 1 : creating a endpoint for user to signup ; '/api/auth/createuser' : No Login Required
router.post('/createuser', [
    //body(keyWhichWantToBeChecked,OptionalMessegeWantedToGiveUser)
    body('name', 'Length Of Name Should Be Minimum 3').isLength({ min: 3 }),
    body('email', 'Please Enter a valid email').isEmail(),
    body('password', 'password must be of minimum length 8').isLength({ min: 8 })
], async (req, res) => {
    try{
        //it will give arrays of error if not present any then returns an empty array
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ Error: err.array() });
        }
        //checking the user with the same email exist or not using .findOne method defined in models, if user not present then it will return null
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json([{ msg: "User Already Exist With The Given Email,Please Login" }])
        }
        const salt = await bcryptjs.genSalt(10);//creating a salt using .genSalt(sizeOfSalt)
        const encrpytPass = await bcryptjs.hash(req.body.password,salt);//encrpting the password using .hash(password,Salt) function

        //creating a user by using .create function which takes the details as argument and it will save the data automatically
        // .then will run if any error not occurs between it and the user created successfully and returning the user data to the page
        // .catch is for catching error and handling the occur error by sending the err to the user without crashing our app
        // User.create(req.body).then(user => res.send(user)).catch((err => res.send(err)));

        user = User.create({
            name:req.body.name,
            password:encrpytPass,
            email:req.body.email
        })
        const data = {
            id:user.id
        }
        const userToken = jwt.sign(data,JWT_SECRET);
        //shorthand for {userToken:userToken} =>{userToken}
        res.json({msg:'Sign Up Successfully!!!',userToken});//returning the user token to the user
    }catch(err){
        console.error(err.msg);//console.error will print the error in the web console
        res.status(500).send([{msg:"Internal Server Error",err:err.msg}]);
    }
})

//Route 2 : creating a endpoint for login : '/api/auth/login' : No Login Required
router.post('/login',[
    body('email','Please Enter a valid email').isEmail(),
    body('password','Password Cannot Be Blank').isLength({min:1})
],async(req,res)=>{
    const err = validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).send(err.array());
    }
    try{
        let user = await User.findOne({'email':req.body.email});
        if(!user){
            return res.json([{msg:"User Not Exist,Please Signup"}]);
        }else{
            //comparing the password using .compare(string,Hash) which will return a boolean value
            const comparePass = await bcryptjs.compare(req.body.password,user.password);
            if(!comparePass){
                return res.json([{msg:"Please Enter a Correct Email/Password"}]);
            }else{
                const data = {
                    id:user.id 
                }
                const userToken = jwt.sign(data,JWT_SECRET);
                return res.json({msg:"Login Successfully!!!",userToken});
            }
        }
    }catch(err){
        console.error(err);
        res.status(500).send([{msg:"Internal Server Error"}]);
    }
})

// Route 3 : creating a endpoint for getting a user using token : '/api/auth/getuser' : Login Required
router.post('/getuser',fetchuser,async(req,res)=>{
    try{
        const _id = req.user.id;
        const user = await User.findOne({_id});
        res.send(user);
    }catch(err){
        console.error(err.msg);
        return res.status(404).send('Internal Server Problem');
    }
})

//exporting the router
module.exports = router