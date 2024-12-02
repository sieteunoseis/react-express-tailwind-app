import validator from "validator";

console.log(validator.isAlphanumeric("jeremy",'en-US')); // true

console.log(validator.isFQDN("hq-cucm-pub.abc.inc", { allow_numeric_tld: true })); // true

console.log(validator.isDecimal("14.00000",{force_decimal: true, decimal_digits: '1,1', locale: 'en-US'})); // true
