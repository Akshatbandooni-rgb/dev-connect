/*
| Mongoose   | OOP Equivalent           | Relational DB Equivalent   |
|------------|--------------------------|----------------------------|
| Schema     | Interface for a Class    | Table Schema (DDL)         |
| Model      | Class based on Interface | Table based on Schema      |
| Document   | Object of a Class        | Record in Table (Row)      |
*/

/*
Steps to Create a Document in Mongoose:

2. **Define a Schema**  
   - Create a `Schema` that defines the structure of the documents.
   - Use `mongoose.Schema()`

3. **Create a Model**  
   - Use `mongoose.model()` to create a Model from the Schema.

4. **Create a Document (Instance of Model) and Save it**  
   - Instantiate a new object using the Model.
   - Call `.save()` to store it in the database.
*/

const mongoose = require('mongoose')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 200
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 200
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
               return validator.isEmail(value)
            },
            message: function (props) {
                return `${props.value} is not a valid email`
            }
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: '{VALUE} is not supported'
        }
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel