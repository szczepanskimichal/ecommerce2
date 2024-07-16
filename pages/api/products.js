// import { mongooseConnect } from "@/lib/mongoose";
// import { Product } from "@/models/Product";

// export default async function handle(req, res) {
//   const { method } = req;
//   await mongooseConnect();

//   if (method === "GET") {
//     if (req.query?.id) {
//       res.json(await Product.findOne({ _id: req.query.id }));
//     }
//     res.json(await Product.find());
//   }

//   if (method === "POST") {
//     const { title, description, price, images, category, properties } =
//       req.body;
//     const productDoc = await Product.create({
//       title,
//       description,
//       price,
//       images,
//       category: category || undefined,
//       properties,
//     });
//     res.json(productDoc);
//   }

//   if (method === "PUT") {
//     const { title, description, price, images, category, properties, _id } =
//       req.body;
//     await Product.updateOne(
//       { _id },
//       { title, description, price, images, category, properties }
//     );
//     res.json(true);
//   }

//   if (method === "DELETE") {
//     if (req.query?._id) {
//       await Product.deleteOne({ _id: req.query?._id });
//       res.json(true);
//     }
//   }
// }

import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  try {
    if (method === "GET") {
      if (req.query?.id) {
        if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
          return res.status(400).json({ error: "Invalid product ID" });
        }
        const product = await Product.findById(req.query.id);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.json(product);
      }
      const products = await Product.find();
      return res.json(products);
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
      return res.status(201).json(productDoc);
    }

    if (method === "PUT") {
      const { title, description, price, images, category, properties, _id } =
        req.body;
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      if (category && !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      await Product.updateOne(
        { _id },
        {
          title,
          description,
          price,
          images,
          category: category || undefined,
          properties,
        }
      );
      return res.json({ success: true });
    }

    if (method === "DELETE") {
      if (!req.query?._id || !mongoose.Types.ObjectId.isValid(req.query._id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      await Product.deleteOne({ _id: req.query._id });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
