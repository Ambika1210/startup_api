import mongoose from 'mongoose';

const companyEmployeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

companyEmployeeSchema.index({ user: 1 });
companyEmployeeSchema.index({ department: 1 });


const CompanyEmployee = mongoose.model('CompanyEmployee', companyEmployeeSchema);

export default CompanyEmployee;
