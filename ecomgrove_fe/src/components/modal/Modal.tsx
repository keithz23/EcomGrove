import React from "react";
import { X, ShoppingCart, AlertCircle } from "lucide-react";

interface CartSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cartItemsCount: number;
  isLoading?: boolean;
}

const CartSyncModal: React.FC<CartSyncModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cartItemsCount,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-transform">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
          <ShoppingCart className="h-6 w-6 text-blue-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Sync Cart Items
        </h3>

        {/* Description */}
        <div className="text-sm text-gray-600 text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            <span>Items found in your local cart</span>
          </div>
          <p>
            You have <strong>{cartItemsCount}</strong> item
            {cartItemsCount !== 1 ? "s" : ""} in your local cart. Would you like
            to sync them to your account?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Syncing...
              </>
            ) : (
              "Sync Cart"
            )}
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          This will add your local cart items to your account cart.
        </p>
      </div>
    </div>
  );
};

export default CartSyncModal;
