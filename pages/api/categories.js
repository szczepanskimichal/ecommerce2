import { mongooseConnect } from "@/lib/mongoose";
import Category from "@/models/Category";

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;

  if (method === "GET") {
    try {
      const categories = await Category.find().populate("parent");
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }

  if (method === "POST") {
    try {
      const { name, parentCategory, properties } = req.body;

      const categoryDoc = await Category.create({
        name,
        parent: parentCategory || undefined,
        properties,
      });
      res.json(categoryDoc);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  }

  if (method === "PUT") {
    try {
      const { name, parentCategory, properties, _id } = req.body;
      const categoryDoc = await Category.updateOne(
        { _id },
        {
          name,
          parent: parentCategory || undefined,
          properties,
        }
      );
      res.json(categoryDoc);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  }

  if (method === "DELETE") {
    try {
      const { _id } = req.body;
      await Category.deleteOne({ _id });
      res.json(true);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  }
}
