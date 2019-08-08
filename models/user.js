const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        trim: true,
        minlength: 1, 
        unique: true
    },
    password:{
        type: String,
        require: true,
        minlength : 6
    },
    tokens:[{
        access:{
            type:String,
            require : true
        },
        token:{
            type:String,
            required: true
        }
    }]
}, {timestamps : true})

    // Creating method to generate authToken
    userSchema.methods.generateAuthToken = async function() {

        let user = this;
        let access = 'auth';
        let token = jwt.sign({_id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
        // Adding access and token variables to our user.tokens array
        user.tokens = user.tokens.concat([{ access, token }]);
        // Await the result of the user.save function
        const savedToken = await user.save();
        
        return token;
    };

    userSchema.statics.findByCredentials = async function(email, password) {
        let User = this;
       
        try{
            // console.log("Trying to find by Credentials")
            const foundUser = await User.findOne({ email: email, password: password});

            // console.log(foundUser);
    
        if(!foundUser){
            return Promise.reject()
        }
        return Promise.resolve(foundUser);
        }catch(err){
            return Promise.reject(err);
        }
    }

const User = mongoose.model('User', userSchema);

module.exports = User;