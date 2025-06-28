import { JSX } from "react";

export interface InformationFields {
  id: string;
  label: string;
  name: string;
  type: string;
  icon: JSX.Element;
}

export interface ChangePasswordFields {
  id: string;
  label: string;
  type: string;
  name: string;
  validations: {
    required: string;
    minLength: {
      value: number;
      message: string;
    };
    pattern: {
      value: RegExp;
      message: string;
    };
  };
}
