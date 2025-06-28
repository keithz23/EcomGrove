import {
  Bell,
  ClipboardList,
  Download,
  Gift,
  Heart,
  IdCard,
  Info,
  Lock,
  Mail,
  MapPin,
  PackageOpen,
  Phone,
  User,
  UserPen,
} from "lucide-react";

export const ProfileItems = [
  { id: 1, name: "Profile", icon: <UserPen /> },
  { id: 2, name: "Information", icon: <Info /> },
  { id: 3, name: "Address", icon: <MapPin /> },
  { id: 4, name: "My Orders", icon: <ClipboardList /> },
  { id: 5, name: "Notification", icon: <Bell /> },
  { id: 6, name: "Change Password", icon: <Lock /> },
];

export const ProfileTabItems = [
  { id: 1, name: "Downloads", icon: <Download size={45} /> },
  { id: 2, name: "Orders", icon: <PackageOpen size={45} /> },
  { id: 3, name: "Wishlist", icon: <Heart size={45} /> },
  { id: 4, name: "Gift Box", icon: <Gift size={45} /> },
];

export const InformationInput = [
  {
    id: 1,
    fields: [
      {
        id: "firstName",
        label: "First name",
        type: "text",
        name: "firstName",
        icon: <IdCard />,
      },
      {
        id: "lastName",
        type: "text",
        label: "Last name",
        name: "lastName",
        icon: <IdCard />,
      },
    ],
  },
  {
    id: 2,
    fields: [
      {
        id: "username",
        label: "Username",
        type: "text",
        name: "username",
        icon: <User />,
      },
      {
        id: "phoneNumber",
        label: "Phone number",
        type: "tel",
        name: "phoneNumber",
        icon: <Phone />,
      },
    ],
  },
  {
    id: 3,
    fields: [
      {
        id: "email",
        label: "Email",
        type: "email",
        name: "email",
        icon: <Mail />,
      },
    ],
  },
];

export const ChangePasswordInput = [
  {
    id: 1,
    fields: [
      {
        id: "oldPassword",
        label: "Old Password",
        type: "password",
        name: "oldPassword",
        validations: {
          required: "Old password is required",
          minLength: {
            value: 8,
            message: "Old password must be at least 8 characters",
          },
          pattern: {
            value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
            message:
              "Password must contain at least one uppercase letter and one special character",
          },
        },
      },
    ],
  },
  {
    id: 2,
    fields: [
      {
        id: "newPassword",
        label: "New Password",
        type: "password",
        name: "newPassword",
        validations: {
          required: "New password is required",
          minLength: {
            value: 8,
            message: "New password must be at least 8 characters",
          },
          pattern: {
            value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
            message:
              "Password must contain at least one uppercase letter and one special character",
          },
        },
      },
      {
        id: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        name: "confirmPassword",
        validations: {
          required: "Confirm password is required",
          minLength: {
            value: 8,
            message: "Confirm password must be at least 8 characters",
          },
          pattern: {
            value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
            message:
              "Password must contain at least one uppercase letter and one special character",
          },
        },
      },
    ],
  },
];
