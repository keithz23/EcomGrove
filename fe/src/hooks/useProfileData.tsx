import { useState, useEffect } from "react";
import { profile } from "../interfaces";
import toast from "react-hot-toast";
import { authService } from "../services";

export const useProfileData = () => {
  const [formData, setFormData] = useState<profile>();
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [updateFormData, setUpdateFormData] = useState<profile>({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      phoneNumber: "",
    },
    address: {
      houseNumber: "",
      city: "",
      street: "",
      ward: "",
      district: "",
      country: "",
    },
    ordersHistory: null,
  });

  const fetchPersonalData = async () => {
    try {
      const response = await authService.profile();
      const personalData = response.data.data;
      const addressData = personalData?.Address;
      const address = addressData?.[0] || {};

      const fetchedData: profile = {
        personal: {
          firstName: `${personalData.firstName}`,
          lastName: `${personalData.lastName}`,
          email: personalData.email || "",
          username: personalData.username || "",
          phoneNumber: personalData.phoneNumber || "",
          profilePicture: personalData.profile_picture,
        },
        address: {
          houseNumber: address.houseNumber || "",
          city: address.city || "",
          street: address.street || "",
          ward: address.ward || "",
          district: address.district || "",
          country: address.country || "",
        },
        ordersHistory: null,
      };

      setFormData(fetchedData);
      setUpdateFormData(fetchedData);
      setIsGoogleLogin(response.data.data.googleId);
    } catch (error) {
      toast.error(`Error fetching personal data: ${String(error)}`);
    }
  };

  const handleChange = (
    section: keyof typeof updateFormData,
    name: string,
    value: string
  ) => {
    setUpdateFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [section]: {
          ...prevData[section],
          [name.replace(" ", "")]: value,
        },
      };

      return updatedData;
    });
  };

  useEffect(() => {
    fetchPersonalData();
  }, []);

  return { formData, updateFormData, handleChange, isGoogleLogin };
};
