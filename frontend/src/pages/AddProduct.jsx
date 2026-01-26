import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddProduct() {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [img3, setImg3] = useState(null);
  const [img4, setImg4] = useState(null);

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

      setName("");
      setPrice("");
      setQuantity(0);
      setCategory("");
      setDescription("");
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
    <section>
      {/* TOP ADMIN NAV */}
      <div className=" sticky top-0 bg-white w-full border-b border-black px-10 py-4 flex items-center justify-between font-light ">
        {/* LOGO */}
         <Link to="/admin">
          <img src="/logo.png" alt="logo" className="h-14" />
        </Link>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

    
    <section className="py-4 px-6 font-[Mulish]">
      {/* HEADER */}
      <div className="text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-[italiana]">
          Add Product
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload new products to your store
        </p>
      </div>

      {/* FORM CARD */}
      <div className="max-w-3xl mx-auto bg-white border p-8 space-y-8 shadow-sm">
        
        {/* NAME + DESCRIPTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="Product Name"
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <textarea
            placeholder="Product Description"
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm resize-none h-[42px]"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* PRICE + QUANTITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="number"
            placeholder="Price"
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
        </div>

        {/* CATEGORY */}
        <select
          className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent"
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

        {/* IMAGES */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Product Images (up to 4)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="file" onChange={e => setImg1(e.target.files[0])} />
            <input type="file" onChange={e => setImg2(e.target.files[0])} />
            <input type="file" onChange={e => setImg3(e.target.files[0])} />
            <input type="file" onChange={e => setImg4(e.target.files[0])} />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="button"
          onClick={submit}
          className="w-full bg-black text-white py-3 text-sm hover:bg-gray-900 transition rounded"
        >
          Add Product
        </button>
      </div>
    </section>
    </section>
  );
}
