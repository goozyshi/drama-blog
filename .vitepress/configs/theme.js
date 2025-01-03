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
    message: '<a href="https://www.youtube.com/watch?v=AkugjXUj5sM" target="_blank">Drama</a> is a song written by IU.',
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
      text: "时序",
      link: "/posts",
    },
    {
      text: "归档",
      link: "/archives",
    },
    {
      text: "标签",
      link: "/tags",
    },
    {
      text: "导航",
      link: "/guide",
    },
    {
      text: "作品",
      items: [
        {
          text: "更多",
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
  bio: "",
  location: "Shenzhen, China",
  timezone: "Asia/Beijing",
  pageSize: 10,
  // md 匹配位置
  mdFilePatterns: ["posts/**/*.md"],
  giscusConfig,
}
