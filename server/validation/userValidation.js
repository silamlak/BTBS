import { body } from "express-validator";

export const purchaseValidationRules =  [
  body("userId").notEmpty().withMessage("userId is required"),

  body("serviceId").notEmpty().withMessage("serviceId is required"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity should be at least 1"),

  body("totalPrice")
    .isFloat({ gt: 0 })
    .withMessage("totalPrice should be greater than 0"),

  body("purchaseDate")
    .optional()
    .isISO8601()
    .withMessage("purchaseDate should be a valid ISO 8601 date"),

  body("paymentMethod")
    .notEmpty()
    .isIn(["TeleBirr", "Abysinia", "Bank Transfer"])
    .withMessage("paymentMethod is not a valid enum value"),

  body("deliveryAddress.phone_no")
    .notEmpty()
    .withMessage("phone_no is required"),

  body("notes").optional().isString().withMessage("notes should be a string"),
];
