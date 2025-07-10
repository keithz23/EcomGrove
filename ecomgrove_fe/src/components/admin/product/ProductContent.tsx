import useProducts from "@/app/hooks/useProducts";
import {
  AlignJustify,
  LayoutGrid,
  List,
  Plus,
  Search,
  SquarePen,
  Trash,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const ProductsContent: React.FC = () => {
  const limit = 12;
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  const handleAddProduct = (formData: any) => {
    setShowAddModal(false);
  };
  const handleEditProduct = (formData: any) => {
    setShowEditModal(false);
  };
  const handleDeleteProduct = () => {
    setShowDeleteModal(false);
  };
  const {
    products: products,
    totalItems,
    totalPages,
    loading,
    refetch,
  } = useProducts(page, limit, "false");

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth" });
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [page]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
            Products
          </h2>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid />
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setViewMode("list")}
              >
                <AlignJustify />
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap"
            >
              <Plus className="mr-2 h-5 w-5"/>
              Add Product
            </button>
            {/* Add Product Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Add New Product
                      </h3>
                      <button
                        onClick={() => setShowAddModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      ></button>
                    </div>
                  </div>
                  <form className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>Electronics</option>
                          <option>Clothing</option>
                          <option>Accessories</option>
                          <option>Footwear</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                          <div className="space-y-1 text-center">
                            <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3"></i>
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload a file</span>
                                <input type="file" className="sr-only" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 !rounded-button whitespace-nowrap"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProduct}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap"
                    >
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Edit Product
                      </h3>
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <form className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedProduct.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          defaultValue={selectedProduct.category}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option>Electronics</option>
                          <option>Clothing</option>
                          <option>Accessories</option>
                          <option>Footwear</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>
                        <input
                          type="number"
                          defaultValue={selectedProduct.price}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock
                        </label>
                        <input
                          type="number"
                          defaultValue={selectedProduct.stock}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Image
                        </label>
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-32 h-32 object-cover object-top rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                          <div className="space-y-1 text-center">
                            <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3"></i>
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload a file</span>
                                <input type="file" className="sr-only" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 !rounded-button whitespace-nowrap"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditProduct}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-md mx-4">
                  <div className="p-6">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                      Delete Product
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-6">
                      Are you sure you want to delete "{selectedProduct.name}"?
                      This action cannot be undone.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 !rounded-button whitespace-nowrap"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteProduct}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 !rounded-button whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Categories */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          {["Electronics", "Clothing", "Accessories", "Footwear"].map(
            (category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            )
          )}
        </div>
      </div>
      {/* Products Grid/List View */}
      <div ref={gridRef} className="p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category.name}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-900">
                      ${product.price}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : product.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900 cursor-pointer !rounded-button whitespace-nowrap">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-red-600 hover:text-red-900 cursor-pointer !rounded-button whitespace-nowrap">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto" ref={listRef}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover object-top"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : product.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        // onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <SquarePen className="h-5 w-5" />
                      </button>
                      <button
                        // onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900 cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 text-sm rounded border ${
                page === i + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
