const router = require('express').Router();
const Teacher = require('../models/Teacher');

router.get('/getAll', async function(req, res){
    try{
        
        let teachers = await Teacher.find({}).lean();
        res.json({teachers});
    }catch(err){
        res.status(500).send('Server Error');
        console.log(err);
    }
});

module.exports = router;