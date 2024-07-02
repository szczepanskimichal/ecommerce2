import React, { useState } from "react";

export default function ProductForm() {
  const [images, setImages] = useState([]);
  return (
    <form>
      <label>Title</label>
      <input type="text" name="Title" />
      <label>Category</label>
      <select></select>
      <label>Photos</label>
      {!images?.length && (
        <div className="text-slate-600">No photos for this product.</div>
      )}
    </form>
  );
}
