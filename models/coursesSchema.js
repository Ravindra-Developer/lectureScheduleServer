const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    course_id: {
        type: String,
        unique: true
    },
    courseName: {
        type: String,
        required: true,
        unique: true
    },
    level: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    batches: [],
    counter: {
        type: Number,
        unique: true,
        required: true
    }
},
    {
        timestamps: { createdOn: 'createdAt', updatedOn: 'updatedAt' },
    })

const course = mongoose.model('course', schema)
module.exports = course