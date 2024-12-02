const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: {type: String, required: true}
});

const TeacherSchema = new Schema({
    name: {type: String, required: true},
    photo: {data: Buffer, contentType: String},
    comments: [CommentSchema]
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;