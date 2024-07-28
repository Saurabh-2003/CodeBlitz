// test.js

// Missing semicolon (linting error)
const greeting = "Hello, world";

// Undefined variable (linting error)
console.log(greetin);

// Unused variable (linting error)
const unusedVariable = 42;

// Function without a return type (linting error if using TypeScript or specific ESLint rules)
function add(a, b) {
  return a + b;
}

add(2, "3"); // This will cause a type error if using TypeScript or a specific ESLint rule
