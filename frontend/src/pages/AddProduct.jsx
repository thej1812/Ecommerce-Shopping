import axios from "axios";
import { useState } from "react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const submit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
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

    alert("Product Added");
  };

  return (
    <div className="p-6">
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Price" onChange={e => setPrice(e.target.value)} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button onClick={submit}>Add</button>
    </div>
  );
}
