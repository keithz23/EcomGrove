"use client";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useCategory from "@/app/features/categories/hooks/useCategory";
import { Switch } from "@/components/ui/switch";
import { IUpdateProduct } from "@/app/features/products/types/update-product.interface";
import { IProducts } from "@/app/types/products/product.interface";

type Props = {
  onClose: () => void;
  onSubmit: (data: IUpdateProduct, picture?: File | null) => void;
  productData: IProducts;
  isSubmitting: boolean;
};

export const EditProductModal = ({
  productData,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IUpdateProduct>({
    mode: "onBlur",
    defaultValues: {
      isActive: true,
    },
  });

  const { categories } = useCategory(1, 10, "true");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productData) {
      reset({
        id: productData.id,
        name: productData.name,
        categoryId: productData.category.id,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
        isActive: productData.isActive,
        picture: productData.image,
        status: productData.status,
      });
      setPreviewImage(productData.image || null);
    }
  }, [productData, categories, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setSelectedFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-screen">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <X />
          </button>
        </div>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <form
            onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))}
            className="p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  {...register("categoryId", {
                    required: "Category is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.categoryId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => {
                    return (
                      <option value={String(category.id)} key={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.price
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  {...register("stock", {
                    required: "Stock is required",
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.stock
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="category"
                  {...register("status", {
                    required: "Status is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.status
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Display Product
                </label>
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(val) => setValue("isActive", val)}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Product Description"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
                >
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mx-auto h-40 object-contain"
                      />
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3"></i>
                        <div className="flex text-sm text-gray-600">
                          <span className="font-medium text-indigo-600 hover:text-indigo-500">
                            Upload a file
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
