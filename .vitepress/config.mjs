import { defineConfig } from "vitepress";
import { BASE_PATH, withBaseURL, gaConfig } from "./configs/base";
import themeConfig from "./configs/theme";
import useMDItPlugins from "./tools/mdit";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Drama",
  description: "goozyshi's blog by Vitepress and Tailwind CSS",
  base: BASE_PATH,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  head: [
    ["meta", { name: "author", content: "Goozyshi" }],
    [
      "link",
      { rel: "icon", type: "image/png", href: withBaseURL("/avatar.png") },
    ],
    ...gaConfig,
  ],
  themeConfig,
  // 路由重写
  rewrites: {
    "pages/:title.md": ":title.md",
    "pages/:title/README.md": ":title.md",
    ":postsdir/:title/README.md": ":postsdir/:title.md",
  },
  srcExclude: ["./README.md"],
  // markdown 增强
  markdown: {
    config: (md) => {
      useMDItPlugins(md);
    },
    image: {
      lazyLoading: true,
    },
    math: true,
  },
});
