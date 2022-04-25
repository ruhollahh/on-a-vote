import type { AppProps } from "next/app";
import type { AppRouter } from "@/backend/routes/_app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";
import superjson from "superjson";

const theme = extendTheme({
  styles: {
    global: {
      "html, body, #__next": {
        height: "100%",
      },
      body: {
        backgroundColor: "gray.700",
        color: "white",
      },
      "#__next": {
        isolation: "isolate",
      },
    },
  },
  colors: {
    parentBg: {
      "50": "#E6E9EF",
      "100": "#D0D6E2",
      "200": "#9EABC2",
      "300": "#6F82A5",
      "400": "#4B5B77",
      "500": "#2D3748",
      "600": "#232B39",
      "700": "#1B222C",
      "800": "#12161C",
      "900": "#0A0C10",
    },
    innerBg: {
      "50": "#FFFFFF",
      "100": "#FDFCFD",
      "200": "#FBF8FC",
      "300": "#FBF8FC",
      "400": "#F9F5FA",
      "500": "#F7F1F8",
      "600": "#D2B1D8",
      "700": "#AD70B8",
      "800": "#774181",
      "900": "#3C2041",
    },
    innerText: {
      "50": "#E7E9F4",
      "100": "#CBD0E7",
      "200": "#9AA5D0",
      "300": "#6676B7",
      "400": "#445492",
      "500": "#2C365E",
      "600": "#242C4C",
      "700": "#1A2038",
      "800": "#121626",
      "900": "#080A11",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

function getBaseUrl() {
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    if (typeof window !== "undefined") {
      return {
        url: "/api/trpc",
        transformer: superjson,
      };
    }

    return {
      headers() {
        return (
          ctx?.req?.headers ?? {
            cookie: "",
          }
        );
      },
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
