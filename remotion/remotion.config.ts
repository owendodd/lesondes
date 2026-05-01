import { Config } from "@remotion/cli/config";

// Serve static assets (fonts, video) from the web project's public dir
Config.setPublicDir("../web/public");

Config.setJpegQuality(100);
Config.setCrf(10);
Config.setMuted(true);
