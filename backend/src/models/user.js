import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  admNo: {
    type: String,
    required: [true, 'Admission number is required'],
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, 'fisrtName is required'],
    trim: true,
  },
  lastName: {
    type: String,
    trim:true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
  },
  profilePic: {
    type: String,
    default: '',
  },
  discipline: {
    type: String,
    required: [true, 'Discipline is required'],
    trim: true,
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true,
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  verificationToken:{
    type:String,
  },
  followers:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'User',
    default:[]
  },
  following:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'User',
    default:[]
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      admNo: this.admNo,
      email: this.email,
    },
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_EXPIRY || '1d',
    }
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_JWT_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRY || '7d',
    }
  );
};

export default mongoose.model('User', userSchema);
