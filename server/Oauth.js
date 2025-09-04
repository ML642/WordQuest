const {OAuth2Client} = require('google-auth-library');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/api/auth/google", async (req, res) => {
 const { code } = req.body;

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "secret_key",
        redirect_uri: "http://localhost:3000", // must match your OAuth config
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();
    console.log("✅ Tokens from Google:", tokens);

    // Example: verify ID token (to get user info like email)
    const { id_token } = tokens;

    // Optionally verify with Google API
    const userInfoRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
    );
    const userInfo = await userInfoRes.json();
    console.log("👤 Google user info:", userInfo);

    const token = jwt.sign(
{
  userName :userInfo.given_name , 
  userEmail : userInfo.email 
}
,process.env.JWT_SECRET || "secret"
,{
  expiresIn : "3h"
} 
      
    ) ; 
    const myAppToken = token;
    
    res.json({ token: myAppToken, user: userInfo });
  } catch (error) {
    console.error("❌ Error exchanging code:", error);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
});
module.exports = router ;