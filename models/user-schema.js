import mongoose from 'mongoose';
import argon2 from 'argon2';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[A-Za-z0-9._%+-]+@[A-za-z0-9.-]+\.[A-Za-z]{2,}$/
  },
  username: {
    type: String,
    required: true,
    match: /^[A-Za-z0-9_\-]+$/,
    minLength: 3,
    maxLength: 15,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 64,
  }
});

userSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: (doc, ret) => { delete ret._id; }
});

// Pre-Hook to Salt and Hash password using argon2id
userSchema.pre('save', async function () {
  // hash and salt password
  try {
    const hash = await argon2.hash(this.password, {
      type: argon2.argon2id
    });
    this.password = hash;
  } catch (err) {
    console.log('Error in hashing password' + err);
  }
});

// Instance method to compare hashes to verify a password
userSchema.methods.verifyPassword =
  async function (plainTextPassword) {
    const dbHashedPassword = this.password;
    try {
      return await argon2.verify(dbHashedPassword, plainTextPassword);
    } catch (err) {
      console.log('Error verifying password' + err);
    }
  }

export default mongoose.model('user', userSchema);