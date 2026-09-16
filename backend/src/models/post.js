import mongoose from 'mongoose';

const postSchema= new mongoose.Schema({
    content:{
        type:String,
        trim: true
    },
    image:{
        type:String,
        default:''
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    imagePublicId:{
        type:String,
        default:''
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    },
    comments:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Comment',
    }
},{timestamps:true});

export default mongoose.model('Post',postSchema);