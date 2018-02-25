module.exports = (input) => {
  let ops = input.split(/\s+/),
      stack = [],
      op;

  // Remove values one at a time from left to right
  while (op = ops.shift()) {
    // Check if `op` is numeric
    if (op == +op) {
      stack.push(op);

      // If not, it must be an operator (check it's valid)
    } else {
      let num2 = stack.pop(),
          num1 = stack.pop(),
          result = eval(num1 + op + num2);

      //console.log(`n1: ${num1}, n2: ${num2}, o: ${op}, r: ${result}`);
      if (num1 === undefined || num2 === undefined || result !== result)
        return null;

      stack.push(result);
    }
  }

  return stack.pop();
}
