import axios from "axios";
import { useEffect, useState } from "react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
const [description, setDescription] = useState("");

  // 🔹 CATEGORY STATE
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  // 🔹 IMAGE STATES (4 inputs)
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [img3, setImg3] = useState(null);
  const [img4, setImg4] = useState(null);

  // 🔹 FETCH CATEGORIES
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const submit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", Number(price));
      formData.append("quantity", Number(quantity));
      formData.append("category", category);
      formData.append("description", description);

      if (img1) formData.append("images", img1);
      if (img2) formData.append("images", img2);
      if (img3) formData.append("images", img3);
      if (img4) formData.append("images", img4);

      await axios.post(
        "http://localhost:5000/api/products/add",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      alert("Product added successfully");

      // optional reset
      setName("");
      setPrice("");
      setQuantity(0);
      setCategory("");
      setImg1(null);
      setImg2(null);
      setImg3(null);
      setImg4(null);

    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>

      <input
        placeholder="Name"
        className="border p-2 block my-2"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        className="border p-2 block my-2"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <textarea
  placeholder="Product Description"
  className="border p-2 my-2 block w-full"
  onChange={e => setDescription(e.target.value)}
/>

      <input
        type="number"
        placeholder="Quantity"
        className="border p-2 block my-2"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
      />

      {/* 🔹 CATEGORY DROPDOWN */}
      <select
        className="border p-2 my-2 block"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* 🔹 4 IMAGE INPUTS */}
      <input type="file" onChange={e => setImg1(e.target.files[0])} />
      <input type="file" onChange={e => setImg2(e.target.files[0])} />
      <input type="file" onChange={e => setImg3(e.target.files[0])} />
      <input type="file" onChange={e => setImg4(e.target.files[0])} />

      <button
        type="button"
        onClick={submit}
        className="bg-black text-white px-4 py-2 mt-4"
      >
        Add Product
      </button>
    </div>
  );
}
