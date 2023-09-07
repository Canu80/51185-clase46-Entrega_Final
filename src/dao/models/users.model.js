import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    age: { type: Number, trim: true },
    email: { type: String, unique: true, trim: true },
    password: { type: String },
    documents: {
      type: [
        {
          name: { type: String, required: true },
          reference: { type: String, required: true },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      require: true,
      enums: ["completo", "incompleto", "pendiente"],
      default: "pendiente",
    },
    avatar: {
      type: String,
      default: "",
    },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
    role: { type: String, default: "Usuario" },
    last_connection: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
  { collection: "Users" }
);

const usersModel = mongoose.model("users", userSchema);

export default usersModel;
