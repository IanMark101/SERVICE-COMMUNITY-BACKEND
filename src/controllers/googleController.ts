import { Request, Response } from "express";
import {
  getGoogleAuthUrl,
  exchangeCodeForToken,
  getGoogleUserInfo,
  findOrCreateUser,
  generateJWT,
} from "../services/googleAuthService";

export const googleLogin = (req: Request, res: Response) => {
  const authUrl = getGoogleAuthUrl();
  res.redirect(authUrl);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "No authorization code" });
    }

    const accessToken = await exchangeCodeForToken(code as string);
    const googleUser = await getGoogleUserInfo(accessToken);
    const user = await findOrCreateUser(googleUser);
    const token = generateJWT(user.id);

    // Redirect to frontend with token (frontend will handle storing in localStorage)
    res.redirect(`https://service-community-frontend.vercel.app/auth/login?token=${token}`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(`http://localhost:3000/auth/login?error=oauth_failed`);
  }
};