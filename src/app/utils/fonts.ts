import localFont from "next/font/local";

export const peaceSans = localFont({
  src: "../../static/fonts/Peace Sans Webfont.ttf",
  variable: "--font-peace-sans",
  display: "swap",
});

export const sodoSans = localFont({
  src: [
    {
      path: "../../static/fonts/SoDoSans-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../static/fonts/SoDoSans-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../static/fonts/SoDoSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../static/fonts/SoDoSans-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../static/fonts/SoDoSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../static/fonts/SoDoSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../static/fonts/SoDoSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../static/fonts/SoDoSans-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../static/fonts/SoDoSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../static/fonts/SoDoSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../static/fonts/SoDoSans-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../static/fonts/SoDoSans-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-sodo-sans",
  display: "swap",
});
