import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Confession text cannot be empty."],
        trim: true,
        maxlength: [500, "Confession cannot be more than 500 characters."]
    },
    likes:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
}, { timestamps: true });

export default mongoose.model('Confession', confessionSchema);