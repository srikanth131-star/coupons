import mongoose from "mongoose";

const navigationSchema = new mongoose.Schema({
  menu: [{
    name: { type: String, required: true },
    url: { type: String, required: true }
  }],
  theme: {
    backgroundColor: { type: String, default: '#7c3aed' },
    textColor: { type: String, default: '#ffffff' }
  }
}, { timestamps: true });

export const Navigation = mongoose.model("Navigation", navigationSchema);