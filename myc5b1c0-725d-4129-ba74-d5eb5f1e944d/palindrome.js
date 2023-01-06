function palindrome(str) {
  const filtered = str
    .toLowerCase()
    .split('')
    .filter(c => c.match(/[a-z0-9]/i));
  return filtered.join('') === filtered.reverse().join('');
}

console.log(palindrome("race car"));
