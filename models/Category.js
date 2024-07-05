import mongoose, { Schema, model, models } from "mongoose";
import { type } from "os";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Category" },
  properties: [{ type: Object }],
});

export default models.Category || model("Category", CategorySchema);
