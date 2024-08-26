import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 15,
    match: /^[A-Za-z0-9_]+$/
  },
  msgText: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 30
  }
});

messageSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: (doc, ret) => { delete ret._id; }
});

export default mongoose.model('message', messageSchema);