import { tokenize } from '../tools/utils'
import { GMAIL_SVG } from '../theme/svg'
import { withBaseURL, giscusConfig } from "./base";

export default {
  outline: "deep",
  docFooter: {
    prev: "Previous",
    next: "Next",
  },
  editLink: {
    pattern: "https://github.com/goozyshi/drama-blog/edit/main/:path",
  },
  footer: {
    message: 'Life is drama.',
    copyright: `MIT Licensed | Copyright © 2019-${new Date().getFullYear()} <a href="https://github.com/goozyshi">goozyshi</a>`,
  },
  lastUpdated: {
    formatOptions: {
      dateStyle: "medium",
      timeStyle: "short",
    },
  },
  nav: [
    {
      text: "POSTS",
      link: "/posts",
    },
    {
      text: "Archives",
      link: "/archives",
    },
    {
      text: "TAGS",
      link: "/tags",
    },
    {
      text: "GUIDE",
      link: "/guide",
    },
    {
      text: "MORE",
      items: [
        {
          text: "ABOUT",
          link: "/about",
        },
        {
          text: "This Repository",
          link: "https://github.com/goozyshi/drama-blog",
          target: "_blank",
        }
      ]
    }
  ],
  search: {
    provider: "local",
    options: {
      detailedView: true,
      miniSearch: {
        // https://lucaong.github.io/minisearch/modules/MiniSearch.html
        options: {
          tokenize
        },
        searchOptions: {
          combineWith: "AND",
          fuzzy: 0.1,
          prefix: true,
          boost: {
            title: 4,
            text: 2,
          },
        }
      },
    },
  },
  socialLinks: [
    { icon: "github", link: "https://github.com/goozyshi" },
    {
      icon: { svg: GMAIL_SVG },
      link: "mailto:goozyshi@gmail.com",
    },
  ],
  // Extended configs
  avatar: withBaseURL("/avatar.png"),
  nickname: "Drama",
  bio: "哇 好多人呀",
  location: "Shenzhen, China",
  timezone: "Asia/Beijing",
  pageSize: 10,
  // md 匹配位置
  mdFilePatterns: ["posts/**/*.md"],
  giscusConfig,
}
