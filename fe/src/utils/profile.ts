import { address, personal } from "../interfaces";

export const labelToKeyMap: Record<string, keyof personal | keyof address> = {
  "First name": "firstName",
  "Last name": "lastName",
  Email: "email",
  Username: "username",
  "Phone number": "phoneNumber",
  "House number": "houseNumber",
  Street: "street",
  Ward: "ward",
  District: "district",
  City: "city",
  Country: "country",
};
