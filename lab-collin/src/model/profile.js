'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  pseudonym: { type: String },
  persona: { type: String },
  catchphrase: { type: String },
  visage: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true, 
  },
});

export default mongoose.model('profile', profileSchema);
