import mongoose from 'mongoose';

const jobOpeningSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  location: {
    type: String,
    trim: true
  },
  salaryRange: {
    min: { type: Number },
    max: { type: Number }
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'paused'],
    default: 'open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

jobOpeningSchema.index({ status: 1 });
jobOpeningSchema.index({ location: 1 });
jobOpeningSchema.index({ title: 'text' });
jobOpeningSchema.index({ postedBy: 1 });

const JobOpening = mongoose.model('JobOpening', jobOpeningSchema);

export default JobOpening;
