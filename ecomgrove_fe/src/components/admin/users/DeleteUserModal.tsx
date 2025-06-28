import { UsersInterface } from "@/app/types/admin/users.interface";
import { TriangleAlert } from "lucide-react";

type Props = {
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  userData: UsersInterface;
};

export const DeleteUserModal = ({
  userData,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <TriangleAlert className="text-red-600 text-xl" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Delete User
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete <b>{userData.email}</b>? This action
            cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              onClick={onSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
