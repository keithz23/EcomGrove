import { JSX } from "react";

export interface personal {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  profilePicture?: string;
}

export interface address {
  houseNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
}

export interface profile {
  personal: personal;
  address: address;
  ordersHistory: null;
}

export interface InformationRow {
  id: number;
  fields: InformationInput[];
}

export interface InformationInput {
  id?: string;
  label: string;
  type?: string;
  value?: string;
  name?: string;
  isDisable?: boolean;
  icon?: JSX.Element;
}

export interface ChangePasswordRow {
  id: number;
  fields: ChangePasswordInput[];
}

export interface ChangePasswordInput {
  id?: string;
  label: string;
  type?: string;
  value?: string;
  name?: string;
  isDisable?: boolean;
  icon?: JSX.Element;
}
