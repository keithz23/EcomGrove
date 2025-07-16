import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { IProducts } from "@/app/types/products/product.interface";
import { Button } from "../ui/button";
import { Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { useCartStore } from "@/app/store/cart/useCartStore";
import { useGuestCartStore } from "@/app/store/cart/useGuestCartStore";

interface Props {
  open: boolean;
  onClose: () => void;
  product: IProducts | null;
}

export default function ProductDetailModal({ open, onClose, product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addItem = isAuthenticated
    ? useCartStore((s) => s.addToCart)
    : useGuestCartStore((s) => s.addToCart);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setIsFavorite(false);
    }
  }, [open]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="sr-only">{product.name}</DialogTitle>
      <DialogContent className="min-w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col lg:flex-row gap-8 p-6">
          {/* Product Image */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isFavorite
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-600 hover:bg-white"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>
                <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-6">
            <div className="inline-block">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                {product.category.name}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-electric-blue">
                ${product.price}
              </span>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) handleQuantityChange(val);
                    }}
                    className="w-16 text-center py-3 border-0 focus:ring-0 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Total:{" "}
                  <span className="font-semibold">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    image: product.image,
                    quantity: quantity,
                  })
                }
                variant={"black"}
                className="flex-1 cursor-pointer"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>

              <Button variant={"border"} className="sm:w-auto px-6 py-3">
                Buy Now
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>SKU:</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Availability:</span>
                <span className="font-medium text-green-600">In Stock</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">
                  Free shipping on orders over $50
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
