module.exports = (input) => {
  let ops = input.split(/\s+/),
      operators = ["+", "-", "*", "/", "%"],
      stack = [],
      op;

  // Remove values one at a time from left to right
  while (op = ops.shift()) {
    // Check if `op` is numeric
    if (op == +op) {
      stack.push(op);
      console.log(`Pushed operand: ${op}.`);

      // if not, it must be an operator (check it's valid)
    } else if (operators.indexOf(op) !== -1) {
      let num2 = stack.pop(),
          num1 = stack.pop(),
          result = eval(num1 + op + num2);

      console.log(`Popped operators: ${num2} and ${num1}.`);

      stack.push(result);
      console.log(`Pushed result: ${result}.`);

    } else {
      throw Error("Invalid expression: " + input);
    }

  }

  return stack.pop();
}
