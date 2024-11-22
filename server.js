const express = require('express');
const bodyParser = require('body-parser');
const validator = require('validator');

const app = express();
app.use(bodyParser.json());

// Helper function to check if a number is prime
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Helper function to handle Base64 file parsing
const parseBase64File = (base64String) => {
  try {
    const buffer = Buffer.from(base64String, 'base64');
    const sizeKB = buffer.length / 1024;
    const mimeType = buffer.toString('utf8', 0, 4).includes('%PDF')
      ? 'application/pdf'
      : 'image/png';
    return { valid: true, mimeType, sizeKB };
  } catch (error) {
    return { valid: false };
  }
};

// POST route for /bfhl
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: 'Invalid input' });
  }

  const numbers = [];
  const alphabets = [];
  let highestLowercase = null;
  let primeFound = false;

  data.forEach((item) => {
    if (validator.isNumeric(item)) {
      numbers.push(item);
      if (isPrime(parseInt(item, 10))) primeFound = true;
    } else if (validator.isAlpha(item)) {
      alphabets.push(item);
      if (item === item.toLowerCase() && (!highestLowercase || item > highestLowercase)) {
        highestLowercase = item;
      }
    }
  });

  const fileInfo = file_b64 ? parseBase64File(file_b64) : { valid: false };

  res.json({
    is_success: true,
    user_id: 'your_name_ddmmyyyy',
    email: 'your_email@example.com',
    roll_number: 'your_roll_number',
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: primeFound,
    file_valid: fileInfo.valid,
    file_mime_type: fileInfo.valid ? fileInfo.mimeType : null,
    file_size_kb: fileInfo.valid ? fileInfo.sizeKB : null,
  });
});

// GET route for /bfhl
app.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
