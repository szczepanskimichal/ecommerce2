// import multiparty from "multiparty";
// import fs from "fs";
// import mime from "mime-types";
// import { mongooseConnect } from "@/lib/mongoose";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// const bucketName = "michal-next-ecommerce";

// export default async function handle(req, res) {
//   await mongooseConnect();

//   const form = new multiparty.Form();
//   const { fields, files } = await new Promise((resolve, reject) => {
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });
//   const client = new S3Client({
//     region: "us-east-1",
//     credentials: {
//       accessKeyId: process.env.S3_ACCESS_KEY,
//       secretAccessKey: process.env.S3_SECRET_KEY,
//     },
//   });
//   const links = [];
//   for (const file of files.file) {
//     const ext = file.originalFilename.split(".").pop();
//     const newFileName = Date.now() + "." + ext;
//     await client.send(
//       new PutObjectCommand({
//         Bucket: bucketName,
//         Key: newFileName,
//         Body: fs.readFileSync(file.path),
//         ACL: "public-read",
//         ContentType: mime.lookup(file.path),
//       })
//     );
//     const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
//     links.push(link);
//   }
//   return res.json({ links });
// }

// export const config = {
//   api: { bodyParser: false },
// };

import multiparty from "multiparty";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const bucketName = "michal-next-ecommerce";

export default async function handle(req, res) {
  await mongooseConnect();

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  const links = [];
  try {
    for (const file of files.file) {
      const ext = file.originalFilename.split(".").pop();
      const newFileName = Date.now() + "." + ext;
      const contentType = mime.lookup(file.path) || "application/octet-stream";

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: newFileName,
          Body: fs.readFileSync(file.path),
          ACL: "public-read",
          ContentType: contentType,
        })
      );

      const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
      links.push(link);

      // Usuwanie tymczasowego pliku
      fs.unlinkSync(file.path);
    }
    res.status(200).json({ links });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ error: "Error uploading files" });
  }
}

export const config = {
  api: { bodyParser: false },
};
