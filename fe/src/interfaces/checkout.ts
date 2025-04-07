export interface DeliveryInput {
  type: string;
  name: string;
  id: string;
  placeHolder?: string;
  value?: string;
  label: string;
}

export interface DeliveryRow {
  id?: number;
  inputs: DeliveryInput[];
}

export interface PaymentInput {
  id?: number;
  inputs: DeliveryInput;
}
