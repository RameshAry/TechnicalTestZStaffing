/*
Problem 60: Prime Pair Sets >>>>> https://projecteuler.net/problem=60

Find the lowest sum for a set of five primes for which any two primes concatenate to produce another prime.
*/

// Memoization function to cache function results
const memoize = (fn) => {
  // Initialize an empty cache object
  const cache = {};

  // Return a function that takes any number of arguments using the rest parameter syntax
  return function (...args) {
    // Generate a unique key based on the input arguments using JSON.stringify
    const key = JSON.stringify(args);

    // Check if the cache already contains a result for the key
    if (cache[key]) {
      // If the result is cached, return the cached result
      return cache[key];
    } else {
      // If the result is not cached, call the original function (fn) with the provided arguments using fn.apply
      const result = fn.apply(this, args);
      // Cache the result with the corresponding key for future use
      cache[key] = result;
      // Return the result
      return result;
    }
  };
};

const isPrime = memoize((num) => {
  /* 
  Check if the number is less than or equal to 1, or if the number is greater than 2 and divisible by 2 (even number)
  In such cases, return false as the number cannot be prime 
  */

  if (num <= 1 || (num > 2 && num % 2 === 0)) return false;

  /*
   After handling divisibility by 2 and 3, the code optimizes the prime check further by only checking divisibility by odd numbers up to the square root of the number.
  This optimization is based on the fact that if a number n is not divisible by any prime number up to its square root, then n itself must be prime.
  By only checking odd numbers as potential divisors (starting from 5), the code skips checking even numbers (except 2) because even numbers other than 2 cannot be prime.
  */

  const sqrtNum = Math.ceil(Math.sqrt(num));

  // Check divisibility by odd numbers up to square root of num
  for (let i = 3; i <= sqrtNum; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
});

// generate prime numbers up to a maximum value
function generatePrimes(max) {
  const primes = [];

  // Loop to generate primes up to max
  for (let num = 3; num <= max; num += 2) {
    if (isPrime(num)) {
      primes.push(num);
    }
  }
  return [2, ...primes];
}

// Concatenates two numbers and checks if both concatenated numbers are prime
const concatToPrime = memoize((a, b) => {
  // Concatenate the numbers a and b in two ways to form two concatenated numbers
  const concat1 = a * Math.pow(10, Math.floor(Math.log10(b) + 1)) + b;
  const concat2 = b * Math.pow(10, Math.floor(Math.log10(a) + 1)) + a;

  // Check if both concatenated numbers (concat1 and concat2) are prime using the isPrime function
  return isPrime(concat1) && isPrime(concat2);
});

// Find all combinations of n elements in a list where every two elements concatenate to a prime
function findCombinations(n, list, acc = []) {
  /*
  we can skip below two lines because we know we have five numbers
  keeping it here just for general scenarios
  */
  // Check if n is 0, indicating an empty combination, return an empty array
  if (n === 0) return [[]];

  // Check if the list is empty, indicating no elements left, return an empty array
  if (list.length === 0) return [];

  // Destructure the first element of the list as x, and the rest as xs
  const [x, ...xs] = list;

  // Initialize an empty array to store results
  const results = [];

  // Check if x can be added to current combination acc
  if (acc.every((y) => concatToPrime(x, y))) {
    // If adding x results in a valid combination, recursively find combinations with n-1 elements
    results.push(
      ...findCombinations(n - 1, xs, [x, ...acc]).map((comb) => [x, ...comb])
    );
  }

  // Continue with combinations without adding x
  results.push(...findCombinations(n, xs, acc));

  // Return the final list of combinations
  return results;
}

const startMin = performance.now(); // Measure start time

// Define the maximum value up to which we want to generate prime numbers
const max = 10000;
const primes = generatePrimes(max);

// Define the set of numbers to generate prime numbers
const numberOfCombinations = 5;

// Find combinations and calculate the sum of each combination
const combinations = findCombinations(parseInt(numberOfCombinations), primes);

if (combinations.length === 0) {
  console.log(
    "No prime number combinations found. Please increase the maximum number of combinations."
  );
  return;
}

const sums = combinations.map((comb) =>
  comb.reduce((acc, curr) => acc + curr, 0)
);

// Find the minimum sum
const minSum = Math.min(...sums);
const endMin = performance.now(); // Measure end time
console.log(
  `Minimum sum calculation time: ${
    parseFloat(endMin - startMin) / 1000
  } seconds`
); // Log performance time

console.log("Lowest sum:", minSum);
