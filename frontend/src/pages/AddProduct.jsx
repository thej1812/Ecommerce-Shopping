import axios from "axios";
import { useState } from "react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);

  const submit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", Number(price));
      formData.append("quantity", Number(quantity));
      formData.append("image", image);

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

      // optional: clear form
      setName("");
      setPrice("");
      setQuantity(0);
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>

      <input
        placeholder="Name"
        className="border p-2 my-2 block"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        className="border p-2 my-2 block"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <input
        type="number"
        min="0"
        placeholder="Quantity"
        className="border p-2 my-2 block"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
      />

      <input
        type="file"
        className="border p-2 my-2 block"
        onChange={e => setImage(e.target.files[0])}
      />

      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 mt-3"
      >
        Add Product
      </button>
    </div>
  );
}
