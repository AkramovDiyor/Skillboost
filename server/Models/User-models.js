const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,

      unique: true,
    },
    location: {
      type: String,
      default: "",  
    },
    specialization: {
      type: String,
      default: "",  
    },
    grade: {  
      type: String,
      default: "",  
    },
    skills: {
      type: [String], 
      default: [],  
    },
    bio: {
      type: String,
      default: "",  
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String, // Хранит URL изображения
      default: "", // Можно задать дефолтное изображение
    },
    bookmarks: [
      {
        type: Types.ObjectId,
        ref: "Question", // название модели вопроса
      },
    ], 
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
