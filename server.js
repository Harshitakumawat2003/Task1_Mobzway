const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoURI = 'mongodb+srv://jainrohit0002:qwert12345@cluster0.hpx1zq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
})
     .then(() => {
          console.log('Database connected successfully');
     })
     .catch((error) => {
          console.error('Database connection failed:', error);
     });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// Define a schema and model for MongoDB
const userSchema = new mongoose.Schema({
     firstName: String,
     lastName: String,
     mobileNo: {
          type: String,
          validate: {
               validator: function (v) {
                    return /^\d{10}$/.test(v);
               },
               message: props => `${props.value} is not a valid mobile number!`
          }
     },
     emailId: {
          type: String,
          validate: {
               validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
               },
               message: props => `${props.value} is not a valid email!`
          }
     },
     address: {
          street: String,
          city: String,
          state: String,
          country: String
     },
     loginId: {
          type: String,
          validate: {
               validator: function (v) {
                    return /^[a-zA-Z0-9]{8,16}$/.test(v);
               },
               message: props => `${props.value} is not a valid login ID!`
          }
     },
     password: {
          type: String,
          validate: {
               validator: function (v) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(v);
               },
               message: props => `Password must be at least 6 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 special character!`
          }
     },
     creationTime: { type: Date, default: Date.now },
     lastUpdatedOn: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Endpoint to create a new user
app.post('/api/users', async (req, res) => {
     try {
          const user = new User(req.body);
          await user.save();
          res.status(201).send(user);
     } catch (error) {
          res.status(400).send(error.message);
     }
});

// Endpoint to get all users
app.get('/api/users', async (req, res) => {
     try {
          const users = await User.find();
          res.status(200).send(users);
     } catch (error) {
          res.status(500).send(error.message);
     }
});

app.listen(3000, () => {
     console.log('Server is running on port 3000');
});


// mongodb+srv://jainrohit0002:<password>@cluster0.hpx1zq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0