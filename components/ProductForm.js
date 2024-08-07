import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperty,
  _id,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperty || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState(existingImages || []);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  async function saveProduct(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    router.push("/products");
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function removeImage(removedImage) {
    setImages(images.filter((image) => image !== removedImage));
  }

  async function uploadImages(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsLoading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const response = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...response.data.links];
      });
      setIsLoading(false);
    }
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?.id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?.id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((property) => (
          <>
            <label className="capitalize">{property.name}</label>
            <select
              value={productProperties[property.name]}
              onChange={(e) => setProductProp(property.name, e.target.value)}
            >
              <option value="">None</option>
              {property.values.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </>
        ))}
      <label>Photos</label>
      {!images?.length && (
        <div className="text-slate-600">No photos for this product.</div>
      )}
      <div className="my-2 flex flex-wrap gap-2">
        {isLoading && (
          <div className="size-24 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <ReactSortable
          className="flex flex-wrap gap-2"
          list={images}
          setList={updateImagesOrder}
        >
          {images?.length > 0 &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-gray-100 flex items-center justify-center rounded-md p-1 border border-gray-100 shadow-md relative group"
              >
                <img src={link} className="rounded-lg h-full w-full" alt="" />
                <div
                  onClick={() => removeImage(link)}
                  className="opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300 absolute -top-2 -right-2 bg-gray-100 border border-gray-300 rounded-full p-1 size-6 flex items-center justify-center text-gray-500 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ))}
        </ReactSortable>
        <label className="w-24 h-24 cursor-pointer rounded-lg border flex flex-col items-center justify-center gap-1 text-primary bg-gray-100 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input
            onChange={uploadImages}
            type="file"
            multiple
            className="hidden"
          />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save product
      </button>
    </form>
  );
}
