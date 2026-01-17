// src/pages/AdminDashboard.jsx
export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="mt-6 space-y-4">
        <a
          href="/admin/add-product"
          className="block bg-black text-white px-4 py-2 w-fit"
        >
          Add Product
        </a>

        <a
          href="/admin/orders"
          className="block bg-gray-800 text-white px-4 py-2 w-fit"
        >
          View Orders
        </a>
        <a
          href="/admin/products"
          className="block bg-gray-800 text-white px-4 py-2 w-fit"
        >
          Manage Products
        </a>
        <a
          href="/admin/categories"
          className="block bg-black text-white px-4 py-2 w-fit"
        >
          Manage Categories
        </a>
       
      </div>
    </div>
  );
}
