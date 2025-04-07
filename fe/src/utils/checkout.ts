import { DeliveryRow, PaymentInput } from "../interfaces";

export const DeliveryItems: DeliveryRow[] = [
  {
    id: 1,
    inputs: [
      {
        label: "Name",
        type: "text",
        name: "name",
        id: "name",
        placeHolder: "Bryan Cranston",
      },
      {
        label: "Mobile Number",
        type: "text",
        name: "mobile",
        id: "mobile",
        placeHolder: "+1 424-236-3574",
      },
    ],
  },
  {
    id: 2,
    inputs: [
      {
        label: "Email",
        type: "email",
        name: "email",
        id: "email",
        placeHolder: "example@email.com",
      },
      {
        label: "City",
        type: "text",
        name: "city",
        id: "city",
        placeHolder: "Hawthorne",
      },
    ],
  },
  {
    id: 3,
    inputs: [
      {
        label: "State",
        type: "text",
        name: "state",
        id: "state",
        placeHolder: "California",
      },
      {
        label: "ZIP",
        type: "text",
        name: "zip",
        id: "zip",
        placeHolder: "90250",
      },
      {
        label: "State",
        type: "text",
        name: "stateAbbr",
        id: "stateAbbr",
        placeHolder: "CA",
      },
    ],
  },
  {
    id: 4,
    inputs: [
      {
        label: "Address",
        type: "text",
        name: "address",
        id: "address",
        placeHolder: "4796 Libby Street",
      },
    ],
  },
];

export const PaymentItems: PaymentInput[] = [
  {
    id: 1,
    inputs: {
      id: "payment-method",
      name: "payment-method",
      type: "radio",
      label: "Online Payment",
      value: "online",
    },
  },
  {
    id: 2,
    inputs: {
      id: "payment-method",
      name: "payment-method",
      type: "radio",
      label: "Cash on Delivery",
      value: "cod",
    },
  },
];
