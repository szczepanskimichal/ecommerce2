import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  await mongooseConnect();
  return res.json(await Order.find().sort({ createdAt: -1 })); //najswiezsze od gory :)
}
