import { ROLE_USER, ROLE_EMPLOYEE, ROLE_ADMIN } from '../constants/enums.js';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [ROLE_USER, ROLE_EMPLOYEE, ROLE_ADMIN],
    default: ROLE_USER
  },
  permissions: {
    type: [String],
    default: []
  },
  companyEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyEmployee',
    default: null
  }
}, {
  timestamps: true
});

userSchema.index({ role: 1 });
userSchema.index({ companyEmployee: 1 });


const User = mongoose.model('User', userSchema);

export default User;
