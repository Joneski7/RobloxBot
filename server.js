const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const codeStore = {}; // { '1234567': { userId: 123456, username: "Lily" } }

app.post('/store', (req, res) => {
  const { code, userId, username } = req.body;
  codeStore[code] = { userId, username };
  res.json({ success: true });
});

app.post('/verify', (req, res) => {
  const { code } = req.body;
  const data = codeStore[code];
  if (data) {
    delete codeStore[code]; // one-time use
    res.json({ success: true, ...data });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => console.log(`Verify server running on port ${PORT}`));
