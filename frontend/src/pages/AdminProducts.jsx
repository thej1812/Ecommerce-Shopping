import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);

        const q = {};
        data.forEach(p => (q[p._id] = p.quantity));
        setQuantities(q);
      });
  };

  // UPDATE QUANTITY
  const updateQuantity = async (id) => {
    await fetch(
      `http://localhost:5000/api/products/${id}/quantity`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({ quantity: quantities[id] })
      }
    );

    alert("Quantity updated");
    fetchProducts(); // refresh list
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    alert("Product deleted");
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Products</h1>

      {products.length === 0 && <p>No products found</p>}

      {products.map(product => (
        <div
          key={product._id}
          className="border p-4 mb-4 flex justify-between items-center"
        >
          {/* PRODUCT INFO */}
          <div>
            <p className="font-bold">{product.name}</p>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.quantity}</p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              value={quantities[product._id]}
              onChange={e =>
                setQuantities({
                  ...quantities,
                  [product._id]: Number(e.target.value)
                })
              }
              className="border p-1 w-20"
            />

            <button
              onClick={() => updateQuantity(product._id)}
              className="bg-black text-white px-3 py-1"
            >
              Update
            </button>

            <button
              onClick={() => deleteProduct(product._id)}
              className="bg-red-600 text-white px-3 py-1"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
