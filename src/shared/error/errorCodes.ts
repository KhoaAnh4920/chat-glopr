import { HttpStatus } from '@nestjs/common';

interface ErrorDetails {
  message: string;
  key: string;
  code: string;
}

enum ERROR_CODE {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  PARAM_INVALID = 'PARAM_INVALID',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_OTP = 'INVALID_OTP',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_OR_PHONE_EXISTS = 'EMAIL_OR_PHONE_EXISTS',
  HTTP_CALL_ERROR = 'HTTP_CALL_ERROR',
  REFERENCE_ERROR = 'REFERENCE_ERROR',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  USER_EXISTED = 'USER_EXISTED',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_NOT_EXIST = 'PRODUCT_NOT_EXIST',
  CATEGORY_NOT_EXIST = 'CATEGORY_NOT_EXIST',
  CART_NOT_FOUND = 'CART_NOT_FOUND',
  CART_ITEM_NOT_EXIST = 'CART_ITEM_NOT_EXIST',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CUSTOMER_NOT_EXIST = 'CUSTOMER_NOT_EXIST',
  SHIPPING_ADDRESS_NOT_EXIST = 'SHIPPING_ADDRESS_NOT_EXIST',
  SUPPLIER_NOT_EXIST = 'SUPPLIER_NOT_EXIST',
  SUPPLIER_NOT_FOUND = 'SUPPLIER_NOT_FOUND',
  DUPLICATE_PRODUCT_CODE = 'DUPLICATE_PRODUCT_CODE',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  ORDER_NOT_EXIST = 'ORDER_NOT_EXIST',
  INVALID_ORDER_STATUS = 'INVALID_ORDER_STATUS',
  ORDER_NOT_COMPLETED = 'ORDER_NOT_COMPLETED',
  ALREADY_REVIEWED = 'ALREADY_REVIEWED',
  REVIEW_NOT_EXIST = 'REVIEW_NOT_EXIST',
  COMMENT_PARENT_NOT_EXIST = 'COMMENT_PARENT_NOT_EXIST',
  INVALID_CITY = 'INVALID_CITY',
  INVALID_DATE = 'INVALID_DATE',
  PROMOTION_NOT_FOUND = 'PROMOTION_NOT_FOUND',
  TICKET_NOT_EXIST = 'TICKET_NOT_EXIST',
  PAYMENT_METHOD_NOT_EXIST = 'PAYMENT_METHOD_NOT_EXIST',
  SHIPPING_METHOD_NOT_EXIST = 'SHIPPING_METHOD_NOT_EXIST',
  NOT_ACCESS_CMS_PAGE = 'NOT_ACCESS_CMS_PAGE',
  REASON_REQUIRED = 'REASON_REQUIRED',
  ORDER_REQUESTING_CANCEL = 'ORDER_REQUESTING_CANCEL',
  INVALID_ORDER_REQUEST_STATUS = 'INVALID_ORDER_REQUEST_STATUS',
  ORDER_REQUEST_NOT_FOUND = 'ORDER_REQUEST_NOT_FOUND',
  TIME_SLOT_NOT_EXIST = 'TIME_SLOT_NOT_EXIST',
  YOU_HAVE_FORBIDDEN_WORD = 'YOU_HAVE_FORBIDDEN_WORD',
  YOU_HAVE_RECEIVED_CODE = 'YOU_HAVE_RECEIVED_CODE',
  END_TIME_IS_VALID = 'END_TIME_IS_VALID',
  FLASH_SALE_TIME_SLOT_NOT_FOUND = 'FLASH_SALE_TIME_SLOT_NOT_FOUND',
  YOU_HAVE_BEEN_SPAM = 'YOU_HAVE_BEEN_SPAM',
  STATIC_PAGE_NOT_EXIST = 'STATIC_PAGE_NOT_EXIST',
  VOUCHER_NOT_FOUND = 'VOUCHER_NOT_FOUND',
  VOUCHER_IS_EXIST = 'VOUCHER_IS_EXIST',
  VOUCHER_CAN_ONLY_BE_USED_ONCE = 'VOUCHER_CAN_ONLY_BE_USED_ONCE',
  EXPIRED_VOUCHER = 'EXPIRED_VOUCHER',
  DISTANCE_ERROR = 'DISTANCE_ERROR',
  INVALID_KEY = 'INVALID_KEY',
  VOUCHER_FREESHIP_IS_NOT_VALID = 'VOUCHER_FREESHIP_IS_NOT_VALID',
  VOUCHER_50_IS_NOT_VALID = 'VOUCHER_50_IS_NOT_VALID',
  VRSNEWMEMBER_IS_NOT_VALID = 'VRSNEWMEMBER_IS_NOT_VALID',
  VRSVOUCHER15K_IS_NOT_VALID = 'VVRSVOUCHER15K_IS_NOT_VALID',
  VRSVOUCHER25K_IS_NOT_VALID = 'VRSVOUCHER25K_IS_NOT_VALID',
  VRSVOUCHER35K_IS_NOT_VALID = 'VRSVOUCHER35K_IS_NOT_VALID',
  EMAIL_INVALID = 'EMAIL_INVALID',
}

const ErrorList = {
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  },
  [ERROR_CODE.PARAM_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Parameters invalid',
  },
  [ERROR_CODE.HTTP_CALL_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Call http error',
  },
  [ERROR_CODE.UNEXPECTED_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Unexpected error',
  },
  [ERROR_CODE.UNAUTHORIZED]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'Invalid email or password',
  },
  [ERROR_CODE.INVALID_OTP]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid OTP',
  },
  [ERROR_CODE.USER_NOT_FOUND]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'User not found',
  },
  [ERROR_CODE.EMAIL_OR_PHONE_EXISTS]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Email or phone exists',
  },
  [ERROR_CODE.REFERENCE_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Cannot get reference info',
  },
  [ERROR_CODE.ROLE_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Role not found',
  },
  [ERROR_CODE.RESOURCE_NOT_FOUND]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Resource not found',
  },
  [ERROR_CODE.USER_EXISTED]: {
    statusCode: HttpStatus.CONFLICT,
    message: 'User existed',
  },
  [ERROR_CODE.INVALID_PASSWORD]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message:
      'Password must has upper case, lower case, digits and must not has space',
  },
  [ERROR_CODE.PRODUCT_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Product not found',
  },
  [ERROR_CODE.PRODUCT_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Product not exist',
  },
  [ERROR_CODE.CATEGORY_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Category not exist',
  },
  [ERROR_CODE.CART_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Cart not found',
  },
  [ERROR_CODE.CART_ITEM_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Cart item not exist',
  },
  [ERROR_CODE.PERMISSION_DENIED]: {
    statusCode: HttpStatus.FORBIDDEN,
    message: 'Permission denied',
  },
  [ERROR_CODE.CUSTOMER_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Customer not exist',
  },
  [ERROR_CODE.SHIPPING_ADDRESS_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Shipping Address not exist',
  },
  [ERROR_CODE.SUPPLIER_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Supplier not exist',
  },
  [ERROR_CODE.DUPLICATE_PRODUCT_CODE]: {
    statusCode: HttpStatus.CONFLICT,
    message: 'Product code already existed in this Supplier',
  },
  [ERROR_CODE.ORDER_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Order not found',
  },
  [ERROR_CODE.ORDER_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Order not exist',
  },
  [ERROR_CODE.INVALID_ORDER_STATUS]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid Order status',
  },
  [ERROR_CODE.ORDER_NOT_COMPLETED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Order is not completed',
  },
  [ERROR_CODE.ALREADY_REVIEWED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Order has been reviewed',
  },
  [ERROR_CODE.REVIEW_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Review not exist',
  },
  [ERROR_CODE.COMMENT_PARENT_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Comment parent not exist',
  },
  [ERROR_CODE.INVALID_CITY]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Invalid city',
  },
  [ERROR_CODE.INVALID_DATE]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid date',
  },
  [ERROR_CODE.PROMOTION_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Promotion not found',
  },
  [ERROR_CODE.SUPPLIER_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Supplier not found',
  },
  [ERROR_CODE.TICKET_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Ticket not exist',
  },
  [ERROR_CODE.PAYMENT_METHOD_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Payment method not exist',
  },
  [ERROR_CODE.SHIPPING_METHOD_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Shipping method not exist',
  },
  [ERROR_CODE.NOT_ACCESS_CMS_PAGE]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'You do not have permission to come this page',
  },
  [ERROR_CODE.REASON_REQUIRED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Reason is requied',
  },
  [ERROR_CODE.ORDER_REQUESTING_CANCEL]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Order is requesting cancellation',
  },
  [ERROR_CODE.INVALID_ORDER_REQUEST_STATUS]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid Order Request status',
  },
  [ERROR_CODE.ORDER_REQUEST_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Order request not found',
  },
  [ERROR_CODE.TIME_SLOT_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Time slot not exist',
  },
  [ERROR_CODE.YOU_HAVE_FORBIDDEN_WORD]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'You have a forbidden word, please re-enter it',
  },
  [ERROR_CODE.YOU_HAVE_RECEIVED_CODE]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'You have been received code, please check your sms',
  },
  [ERROR_CODE.END_TIME_IS_VALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'End_time must be bigger than Start_time',
  },
  [ERROR_CODE.FLASH_SALE_TIME_SLOT_NOT_FOUND]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Flash sale time slot does not exist',
  },
  [ERROR_CODE.YOU_HAVE_BEEN_SPAM]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'You have been sent sms 5 times! Please come back tomorrow',
  },
  [ERROR_CODE.STATIC_PAGE_NOT_EXIST]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Static Page not exist',
  },
  [ERROR_CODE.VOUCHER_NOT_FOUND]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Voucher does not exist',
  },
  [ERROR_CODE.VOUCHER_IS_EXIST]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Voucher is already exists',
  },
  [ERROR_CODE.VOUCHER_CAN_ONLY_BE_USED_ONCE]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Voucher can only be used once',
  },
  [ERROR_CODE.EXPIRED_VOUCHER]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Expired Voucher',
  },
  [ERROR_CODE.DISTANCE_ERROR]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: "Can't get distance between 2 address",
  },
  [ERROR_CODE.INVALID_KEY]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid key',
  },
  [ERROR_CODE.VOUCHER_FREESHIP_IS_NOT_VALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Voucher is only valid for less than 3 orders',
  },
  [ERROR_CODE.VOUCHER_50_IS_NOT_VALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'You have not yet been able to use this voucher',
  },
  [ERROR_CODE.VRSNEWMEMBER_IS_NOT_VALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'You have more than 1 order',
  },
  [ERROR_CODE.VRSVOUCHER15K_IS_NOT_VALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Voucher is only applicable for orders over 100,000 VND',
  },
  [ERROR_CODE.VRSVOUCHER25K_IS_NOT_VALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Voucher is only applicable for orders over 150,000 VND',
  },
  [ERROR_CODE.VRSVOUCHER35K_IS_NOT_VALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Voucher is only applicable for orders over 200,000 VND',
  },
  [ERROR_CODE.EMAIL_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Email address is not valid',
  },
};
export { ErrorDetails, ERROR_CODE, ErrorList };
