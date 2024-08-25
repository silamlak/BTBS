import {body} from 'express-validator'

export const addServiceValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name Required")
    .isString()
    .withMessage("Name Must Be String"),
  body("desc")
    .trim()
    .notEmpty()
    .withMessage("Description Required")
    .isString()
    .withMessage("Description Must Be String"),
  body("s_img")
    .trim()
    .notEmpty()
    .withMessage("Image Required")
    .isString()
    .withMessage("Image Must Be String"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than zero"),
  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number")
    .custom((value) => value >= 0 && value <= 100)
    .withMessage("Discount must be between 0 and 100"),
  body("category")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Category must be a string"),
];

export const addOfferValidator = [
  body("service_id")
    .trim()
    .notEmpty()
    .withMessage("ServiceId Required")
    .isString()
    .withMessage("ServiceId Must Be String"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name Required")
    .isString()
    .withMessage("Name Must Be String"),
  body("o_img")
    .trim()
    .notEmpty()
    .withMessage("Image Required")
    .isString()
    .withMessage("Image Must Be String"),
  body("desc")
    .trim()
    .notEmpty()
    .withMessage("Description Required")
    .isString()
    .withMessage("Description Must Be String"),
  body("off")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number")
    .custom((value) => value >= 0 && value <= 100)
    .withMessage("Discount must be between 0 and 100"),
];


export const addCatagorieValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title Required")
    .isString()
    .withMessage("Title Must Be String"),
  body("desc")
    .trim()
    .notEmpty()
    .withMessage("Description Required")
    .isString()
    .withMessage("Description Must Be String"),
];