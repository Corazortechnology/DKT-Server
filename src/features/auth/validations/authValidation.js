import Joi from "joi";

const schemas = {
  beneficiary: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
    }),
    schoolName: Joi.string().required(),
    otherDetails: Joi.string().optional(),
  }),
  donor: Joi.object({
    companyName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
    }),
    donationDetails: Joi.string().optional(),
  }),
  admin: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
    }),
    role: Joi.string().valid("admin").required(),
  }),
  partner: Joi.object({
    partnerName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
    }),
    servicesProvided: Joi.string().optional(),
  }),
};

export const validateRegistration = (section, data) => {
  const schema = schemas[section];
  if (!schema) {
    throw new Error("Validation schema not defined for this section");
  }
  return schema.validate(data);
};
