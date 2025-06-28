export const inputFields = [
  {
    name: "firstName",
    label: "First Name",
    placeHolder: "Enter your first name",
    type: "text",
    validation: {
      required: "First name is required",
      minLength: {
        value: 2,
        message: "First name must be at least 2 characters",
      },
    },
  },
  {
    name: "lastName",
    label: "Last Name",
    placeHolder: "Enter your last name",
    type: "text",
    validation: {
      required: "Last name is required",
      minLength: {
        value: 2,
        message: "Last name must be at least 2 characters",
      },
    },
  },
  {
    name: "username",
    label: "Username",
    placeHolder: "Enter your username",
    type: "text",
    validation: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters",
      },
    },
  },
  {
    name: "phone",
    label: "Phone Number",
    placeHolder: "Enter your phone number",
    type: "tel",
    validation: {
      required: "Phone number is required",
      pattern: {
        value: /^[0-9]{10,}$/,
        message: "Phone number must be at least 10 digits",
      },
    },
  },
  {
    name: "email",
    label: "Email",
    placeHolder: "Enter your email",
    type: "email",
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: "Invalid email format",
      },
    },
  },
  {
    name: "password",
    label: "Password",
    placeHolder: "Enter your password",
    type: "password",
    validation: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      pattern: {
        value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
        message:
          "Password must contain at least one uppercase letter and one special character",
      },
    },
  },
] as const;
