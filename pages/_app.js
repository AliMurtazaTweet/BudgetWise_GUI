import "@/styles/globals.css";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/ThemeProvider";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider defaultTheme="light">
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
