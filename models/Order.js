import { Schema, model, models } from "mongoose";
const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    City: String,
    postalCode: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

export default Order = models?.Order || model("Order", OrderSchema);
