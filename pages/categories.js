import { withSwal } from "react-sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "mongoose";
// import { reverse } from "dns";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }
  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories(); // Refresh the list of categories, bedzie sie odzmieniac odrazu po zmianie kategorii
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parentCategory?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete category ${category.name}?`,
        showCancelButton: true,
        CancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          // await axios.delete(`/api/categories/${_id}`);
          await axios.delete("api/categories?_id=" + _id);
        }
      });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((property, index) => {
        return index !== indexToRemove;
      });
    });
  }

  function handlePropertyNameChange(index, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  return (
    <>
      <h1>Categories</h1>
      <form onSubmit={saveCategory}>
        <label>
          {editedCategory
            ? `Edit category ${editedCategory.name}`
            : "New category name"}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col items-start gap-2 mb-3">
          <label className="block">Properties</label>
          <button onClick={addProperty} type="button" className="btn-secondary">
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  onChange={(e) =>
                    handlePropertyNameChange(index, e.target.value)
                  }
                  placeholder="Property name"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValuesChange(index, e.target.value)
                  }
                  placeholder="Values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-delete"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Save
          </button>
          {editedCategory && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {!editedCategory && (
        <table>
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category?.parentCategory?.name}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
