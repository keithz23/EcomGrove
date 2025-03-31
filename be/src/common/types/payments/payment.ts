export interface PaymentProps {
  id?: number;
  amount: AmountProps;
  payer: PayerProps;
  method: string;
  address: AddressProps;

  transactionId?: string;
  captureId?: string;
  rawResponse?: JSON;
}

interface AmountProps {
  value: string;
  currencyCode: string;
}

interface PayerProps {
  payerId: string;
  name: {
    givenName: string;
    surName: string;
  };
  email: string;
}

interface AddressProps {
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode: string;
  countryCode: string;
}
