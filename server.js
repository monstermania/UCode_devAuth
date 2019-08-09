// Require dotenv
require('dotenv').config();
// Require constants
const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    User = require('./models/user'),
    authenticate = require('./middleware/authenticate'),
    PORT = process.env.PORT || 3000;

// Connect database
require('./db/mongoose');

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '../public/views'));
// Routes
    // HOME Route
    app.get('/', (req, res) => {
        res.json({ success: true })
    });
    // API Root Route
    app.get('/api', (req, res) => {
        res.json({ message: `API Root Route`})
    });

    app.get('/about', authenticate, (req, res) =>{
        res.sendFile(path.join(__dirname, '/public/views/about.html'));
    })

    //create user route
    app.post('/user/create', async (req, res) =>{
       console.log(req.body); 

       let user = new User({
           email: req.body.email,
           password: req.body.password
       });

    try{
       const savedUser = await user.save();
       res.status(200).send(savedUser);
    }

    catch(err){
        res.status(404).send(err);
    }
    });
    // User login route
   // User Login Route
app.post('/users/login', async (req, res) => {
    console.log(`Finding user email: ${req.body.email} and password ${req.body.password} for login`);
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        console.log(`This is my user found: ${user}`)
        const createdToken = await user.generateAuthToken();
        
        res.status(200).header('x-auth', createdToken).send(user);
    } catch (err) {
    res.status(400).send({errorMsg: err});
    console.log(`This is my error: ${err}`)
    }
})

// Listening on Port
app.listen(PORT, err => {
    console.log( err || `Server listening on PORT ${PORT}`)
})