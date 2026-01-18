import mongoose from "mongoose";

const sentMailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "EmailTemplate",
    },
  },
  {
    timestamps: true,
  }
);

const sendEmail = mongoose.model("sentMail", sentMailSchema);

export default sendEmail;
