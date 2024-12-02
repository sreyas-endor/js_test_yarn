const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./config/PassportSetup');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const teacherRoutes = require('./routes/teacherRoutes');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Teacher = require('./models/Teacher');
//const cors = require('cors');

const fs = require('fs');
const path = require('path');


app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Connect to DB
mongoose.connect(process.env.DB_URI,
  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Connection established");
  }
});

//Set cookies
app.use(cookieSession({
  maxAge: 60*24*60*60*1000,
  keys: [process.env.SESSION_KEY]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//CORS
// var whitelist = ['http://localhost:19001']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
//app.use(cors({credentials: true, origin: true}));

//Routes
app.use('/auth', authRoutes);
app.use('/teacher', teacherRoutes);

server.listen(process.env.PORT, function(){
  console.log("Listening to port" + process.env.PORT)
});

app.get('/script', function(req, res){
    let direct = path.join(__dirname, "..", "facultyData")
    fs.readdir(direct, function(err, files){
        if(err){
            res.send(err);
            return;
        }
        files.forEach(async function(file, index){
            let teacher = new Teacher({name: file.slice(0, file.length - 4), photo: {data: fs.readFileSync(path.join(direct, file)), contentType: 'image/jpeg'}});
            try{
                await teacher.save();
                console.log(teacher);
            } catch(err){
                console.log(err);
            }
        });
        res.send("Check Console");
    });
});

io.on('connection', (socket) => {
  socket.on('comment', async (msg) => {
    console.log(msg);
    try{
      let teacher = await Teacher.findById(msg.id);
      console.log(teacher.comments);
      teacher.comments.push({comment: msg.comment});
      await teacher.save();
      io.emit('comment', {id: msg.id, comment: teacher.comments[teacher.comments.length - 1]});
    }catch(err){
      console.log(err);
    }
  });
});