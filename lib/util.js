const rpn = require("./rpn");

// Remove all non-digits and non-operators
const normalize = input => input.replace(/[^\d+\-\/*% ]/g, "");

// Iterate over a normalized input to delimit based on operators/operands
function format(input) {
  let chars = input.split(""),
      acc   = "",
      expr  = [];

  chars.forEach(c => {
    if (c == +c) {
      acc += c;
    } else {
      if (acc !== "") {
        expr.push(acc);
        acc = "";
      }
      expr.push(c);
    }
  });

  if (acc !== "")
    expr.push(acc);

  return expr.join(" ").replace(/\s+/g, " ");
}

// Check a normalized & formatted equation to see if it's valid RPN
function validate(input) {
  for (let i = 0; i < input.length; i++) {
    if (input[i].split(" ").filter(n => n !== "").length < 3) return false;
    if (rpn(input[i]) === null) {
      console.log(`[INVALID] rpn(${input[i]}) = ${rpn(input[i])}`);
      return false;
    }
  }
  return true;
}

module.exports = {
  normalize,
  format,
  validate
};
