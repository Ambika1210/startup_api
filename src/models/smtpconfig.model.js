import mongoose from "mongoose";

const smtpConfigSchema = new mongoose.Schema(
  {
    smtpHost: {
      type: String,
      required: true,
      trim: true,
    },

    smtpPort: {
      type: Number,
      required: true,
    },

    isSecure: {
      type: Boolean,
      default: false, // true for 465, false for 587
    },

    smtpUsername: {
      type: String,
      required: true,
      trim: true,
    },

    smtpPassword: {
      type: String,
      required: true, // encrypted app password
    },

    fromEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    fromName: {
      type: String,
      required: true,
      trim: true,
    },

    smtpProvider: {
      type: String,
      enum: ["gmail", "outlook", "zoho", "custom"],
      default: "custom",
    },

    
    isActive: {
      type: Boolean,
      default: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

smtpConfigSchema.index(
  { userId: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

const SmtpConfig = mongoose.model("SmtpConfig", smtpConfigSchema);

export default SmtpConfig;
