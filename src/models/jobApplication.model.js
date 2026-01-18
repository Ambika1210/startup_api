import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobOpening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOpening',
    required: true
  },
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  applicantEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  resumeUrl: {
    type: String,
    required: true,
    trim: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  portfolioUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    default: 'applied'
  }
}, {
  timestamps: true
});

jobApplicationSchema.index({ jobOpening: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ applicantEmail: 1 });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
