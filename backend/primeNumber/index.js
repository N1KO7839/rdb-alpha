function isPrime(number) {
  if (typeof number !== "number" || !Number.isInteger(number) || number <= 1) {
    return false;
  }

  if (number === 2) {
    return true;
  }

  if (number % 2 === 0) {
    return false;
  }

  for (let i = 3; i * i <= number; i += 2) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

module.exports = {
  isPrime
};