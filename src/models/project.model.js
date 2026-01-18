import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'on-hold'],
    default: 'planned'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyEmployee',
    required: true
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyEmployee'
  }],
  client: {
    type: String,
    trim: true
  },
  budget: {
    type: Number
  }
}, {
  timestamps: true
});

projectSchema.index({ status: 1 });
projectSchema.index({ manager: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
