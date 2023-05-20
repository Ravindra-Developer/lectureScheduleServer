const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    user_id: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    InstructorName: {
        type: String,
        required: true
    },
    DatesAssigned: [],
    counter: {
        type: Number,
        unique: true,
        required: true
    }
},
    {
        timestamps: { createdOn: 'createdAt', updatedOn: 'updatedAt' },
    })

const instructor = mongoose.model('instructor', schema)
module.exports = instructor