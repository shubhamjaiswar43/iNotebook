const express = require('express');
const routes = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const {body,validationResult} = require('express-validator');
// Route 1 : creating a endpoint for adding a note to a logined user : '/api/note/addnote' : Login Required
routes.post('/addnote',fetchuser,[
    body('title','Length Must Be Minimum 3').isLength({min:3}),
    body('description','Length Must Be Minimum 5').isLength({min:5})
],(req,res)=>{
    const err = validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).send(err.array());
    }
    try{
        Note.create({
            title:req.body.title,
            description:req.body.description,
            tag:req.body.tag,
            user:req.user.id
        }).then(note=>res.send(note));
    }catch(err){
        console.error(err);
        res.status(400).send('Internal Server Problem');
    }
});

// Route 2 : creating a endpoint for getting all note to a logined user : '/api/note/getnotes' : Login Required
routes.get('/getnotes',fetchuser,async(req,res)=>{
    try{
        const note = await Note.find({user:req.user.id});
        return res.json(note);
    }catch(err){
        console.error(err.message);
        res.status(400).send('Internal Server Problem');
    }
});

// Route 3 : creating a endpoint for updating a note to a logined user : '/api/note/updatenode/:id' : Login Required
routes.put('/updatenote/:id',fetchuser,async(req,res)=>{ //we can use post request but it is preferrable to use put request to update
    try{
        let note = await Note.findOne({_id:req.params.id});
        if(!note){
            return res.status(404).send("Note Doesn't Exist");
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Unable To Update");
        }
        note = await Note.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.json(note);
    }catch(err){
        console.error(err.message);
        res.status(400).send('Internal Server Problem');
    }
});

// Route 4 : creating a endpoint for deleting a note to a logined user : '/api/note/deletenote' : Login Required
routes.delete('/deletenote/:id',fetchuser,async(req,res)=>{ //we can use post request but it is preferrable to use delete request to update
    try{
        let note = await Note.findOne({_id:req.params.id});
        if(!note){
            return res.status(404).send("Note Doesn't Exist");
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Unable To Delete");
        }
        // note = await Note.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({message:"Note Deleted Successfully!!!"});
    }catch(err){
        console.error(err.message);
        res.status(400).send('Internal Server Problem');
    }
});

module.exports = routes