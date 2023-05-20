const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    lectureDate: {
        type: String,
        unique: true
    },
    user_id: {
        type: String,
        required: true
    },
    InstructorName: {
        type: String,
        required: true
    },
    course_id: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    batch: {
        type: String
    }
},
    {
        timestamps: { createdOn: 'createdAt', updatedOn: 'updatedAt' },
    })

const ScheduledLecSchema = mongoose.model('ScheduledLecSchema', schema)
module.exports = ScheduledLecSchema