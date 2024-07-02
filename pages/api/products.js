import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/product";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "Get") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    }
    res.json(await Product.find());
  }

  if (method === "POST") {
    const { title, description, price, images, category, properties } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category: category || undefined,
      properties,
    });
  }
}
