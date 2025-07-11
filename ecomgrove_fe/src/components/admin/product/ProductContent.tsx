import {
  initialModalState,
  userModalReducer,
} from "@/app/features/users/reducers/userModal.reducer";
import {
  AlignJustify,
  LayoutGrid,
  Plus,
  Search,
  SquarePen,
  Trash,
} from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";
import { AddProductModal } from "./AddProductModal";
import useProducts from "@/app/features/products/hooks/useProducts";
import { ICreateProduct } from "@/app/features/products/types/create-product.interface";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import { productService } from "@/app/services/admin/product.service";
import { useProductDetail } from "@/app/features/products/hooks/useProductDetail";
import { EditProductModal } from "./EditProductModal";
import { IUpdateProduct } from "@/app/features/products/types/update-product.interface";
import useDisableScroll from "@/app/hooks/useDisableScroll";
import { DeleteProductModal } from "./DeleteProductModal";
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter";

export const ProductsContent: React.FC = () => {
  const limit = 12;
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [modalState, dispatch] = useReducer(
    userModalReducer,
    initialModalState
  );
  useDisableScroll(
    modalState.showAdd || modalState.showEdit || modalState.showDelete
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProduct = async (
    data: ICreateProduct,
    picture?: File | null
  ) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, (data as any)[key]);
      }

      if (picture) {
        formData.append("picture", picture);
      }

      await toast.promise(productService.createProduct(formData), {
        loading: "Creating product...",
        success: "Product created successfully",
        error: (err) => getErrorMessage(err),
      });

      refetch();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (
    data: IUpdateProduct,
    picture?: File | null
  ) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, (data as any)[key]);
      }

      if (picture) {
        formData.append("picture", picture);
      }
      await toast.promise(productService.updateProduct(formData), {
        loading: "Updating product...",
        success: "Product updated successfully",
        error: (err) => getErrorMessage(err),
      });
      console.log(JSON.stringify(data));
      refetch();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    setIsSubmitting(true);
    try {
      await toast.promise(productService.deleteProduct(product.id), {
        loading: "Deleting product...",
        success: "Product deleted successfully",
        error: (err) => getErrorMessage(err),
      });
      refetch();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowAddModal = () => {
    dispatch({ type: "SHOW_ADD" });
  };
  const {
    products: products,
    totalPages,
    refetch,
  } = useProducts(page, limit, "false");

  const handleShowEditModal = async (id: string) => {
    try {
      await fetchProduct(id);
      dispatch({ type: "SHOW_EDIT" });
    } catch (error) {
      toast.error("Failed to load user info");
    }
  };

  const handleShowDeleteModal = async (id: string) => {
    try {
      await fetchProduct(id);
      dispatch({ type: "SHOW_DELETE" });
    } catch (error) {
      toast.error("Failed to load user info");
    }
  };

  const { product, fetchProduct } = useProductDetail();

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
              onClick={handleShowAddModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </button>
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
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <span
                      className={`inline-block text-xs font-semibold rounded-full px-2 py-1 ${
                        product.isActive === "true"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive === "true" ? "Active" : "Inactive"}
                    </span>
                  </div>
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
                      <button
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer !rounded-button whitespace-nowrap"
                        onClick={() => {
                          handleShowEditModal(product.id);
                        }}
                      >
                        <SquarePen />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 cursor-pointer !rounded-button whitespace-nowrap"
                        onClick={() => {
                          handleShowDeleteModal(product.id);
                        }}
                      >
                        <Trash />
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
                    Display Product
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isActive === "true"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive === "true" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleShowEditModal(product.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <SquarePen className="h-5 w-5" />
                      </button>
                      <button
                        // onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900 cursor-pointer !rounded-button whitespace-nowrap"
                        onClick={() => {
                          handleShowDeleteModal(product.id);
                        }}
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

      {/* Modals */}
      {modalState.showAdd && (
        <AddProductModal
          isSubmitting={isSubmitting}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleAddProduct}
        />
      )}
      {modalState.showEdit && product && (
        <EditProductModal
          isSubmitting={isSubmitting}
          productData={product}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleEditProduct}
        />
      )}
      {modalState.showDelete && product && (
        <DeleteProductModal
          isSubmitting={isSubmitting}
          productData={product}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleDeleteProduct}
        />
      )}
    </div>
  );
};
