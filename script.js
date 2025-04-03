const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store data in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve data from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Clear local storage
function clearStorage() {
  localStorage.clear();
}

// Generate SHA256 hash
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Get SHA256 hash for a random 3-digit number
async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (!cached) {
    const randomNumber = getRandomArbitrary(MIN, MAX).toString();
    cached = await sha256(randomNumber);
    store('sha256', cached);
  }
  return cached;
}

// Display the SHA256 hash
async function main() {
  sha256HashView.innerHTML = 'Generating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Validate user input and check against stored hash
async function test() {
  const pin = pinInput.value.trim();
  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Enter a 3-digit number!';
    resultView.classList.remove('hidden');
    return;
  }

  const userHash = await sha256(pin);
  const storedHash = sha256HashView.innerHTML;

  if (userHash === storedHash) {
    resultView.innerHTML = '🎉 Success! You found the number!';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Incorrect. Try again!';
  }
  resultView.classList.remove('hidden');
}

// Ensure pinInput only accepts numbers and is 3 digits long
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach test function to the button
document.getElementById('check').addEventListener('click', test);

// Run the main function to generate and display hash
main();
