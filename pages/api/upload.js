import multiparty from "multiparty";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const bucketName = "ecommerce2-michal";

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
    region: "eu-north-1", // Poprawiono region na właściwy
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFileName = Date.now() + "." + ext;
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFileName}`; // Poprawiono link na właściwy endpoint
    links.push(link);
  }
  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
