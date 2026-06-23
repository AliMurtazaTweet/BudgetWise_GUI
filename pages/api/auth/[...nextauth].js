import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions = {
  debug: true, // Enable debug logs to catch environment issues in the terminal
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "mock_google_id",
      clientSecret: process.env.GOOGLE_SECRET || "mock_google_secret",
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "mock_apple_id",
      clientSecret: process.env.APPLE_SECRET || "mock_apple_secret",
    }),
    {
      id: "azure-ad",
      name: "Microsoft",
      type: "oauth",
      authorization: {
        url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        params: { scope: "openid profile email" },
      },
      token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      userinfo: "https://graph.microsoft.com/oidc/userinfo",
      clientId: process.env.AZURE_AD_CLIENT_ID || "mock_microsoft_id",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "mock_microsoft_secret",
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  
  // Custom pages
  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "fallback_mock_secret_for_development",
};

export default NextAuth(authOptions);
