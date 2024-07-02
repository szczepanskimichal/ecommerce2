import { Timestamp } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";
import { type } from "os";

const ProductSchema = new Schema(
  {
    tittle: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
  },
  {
    timestamps: true,
  }
);
const Product = models.Product || model("Product", ProductSchema);
export default Product;
