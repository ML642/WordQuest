const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwtSecret;
};

const getGoogleConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "postmessage";

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth environment variables are not configured");
  }

  return { clientId, clientSecret, redirectUri };
};

router.post("/api/auth/google", async (req, res) => {
  const code = String(req.body.code || "").trim();
  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const { clientId, clientSecret, redirectUri } = getGoogleConfig();
    const oauthClient = new OAuth2Client(clientId, clientSecret, redirectUri);

    const { tokens } = await oauthClient.getToken(code);
    if (!tokens || !tokens.id_token) {
      return res.status(401).json({ error: "Failed to obtain Google ID token" });
    }

    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({ error: "Invalid Google account data" });
    }

    const token = jwt.sign(
      {
        userName: payload.given_name || payload.name || payload.email,
        userEmail: payload.email
      },
      getJwtSecret(),
      { expiresIn: "3h" }
    );

    return res.json({
      token,
      user: {
        email: payload.email,
        given_name: payload.given_name,
        family_name: payload.family_name,
        name: payload.name,
        picture: payload.picture
      }
    });
  } catch (error) {
    console.error("Google auth error:", error.message);
    return res.status(500).json({ error: "Failed to authenticate with Google" });
  }
});

module.exports = router;
