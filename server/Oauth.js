const OAuth2Client = require('google-auth-library');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/api/auth/google", async (req, res) => {
  const { token } = req.body; 

  try {

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload(); // verified Google user info
    console.log("Google verified user:", payload);

    // Example: create our own JWT for the app
    const appToken = jwt.sign(
      { email: payload.email, userId: payload.sub },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ user: payload, token: appToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

module.exports = router ;