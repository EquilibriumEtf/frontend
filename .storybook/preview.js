import "../styles/globals.css";
import * as NextImage from "next/image";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 12
import { addDecorator } from "@storybook/react";
import themeDecorator from "./themeDecorator";

addDecorator(themeDecorator);

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "Black",
    values: [
      {
        name: "Black",
        value: "#000000",
      },
      {
        name: "White",
        value: "#FFFFFF",
      },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  previewTabs: {
    "storybook/docs/panel": { index: -1 },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};
