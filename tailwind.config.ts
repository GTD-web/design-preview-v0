import type { Config } from "tailwindcss";
import designSystemConfig from "./packages/design-system/tailwind.config";

const config: Config = {
  ...designSystemConfig,
};

export default config;
