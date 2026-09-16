import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    options:[{
        text:{
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        votes:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User'
        }
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true});

export default mongoose.model('Poll', pollSchema);