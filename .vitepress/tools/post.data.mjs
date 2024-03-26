/**
 * Post https://vitepress.dev/guide/data-loading
 */
import { createContentLoader } from "vitepress"
import readingTime from "reading-time"
import themeConfig from "../conifgs/theme"

import { withBaseURL, isProduction } from "../conifgs/base"

function getFirstMarkdownTitle(text) {
  const match = text.match(/^# (.*)$/m);
  return match ? match[1] : "Untitled";
}

export const data = []

const getPostFormatter = async (options = {}) => {
  const {
    includeSrc = true,
    render = false,
    excerpt = false,
  } = options

  return createContentLoader(themeConfig.mdFilePatterns, {
    includeSrc,
    render,
    excerpt,
    transform(rawData) {
      return rawData
        .map(p => {
          const rt = readingTime(p.src || "")
          const mdpath = p.url.replace("/README", "")
          p.url = withBaseURL(mdpath)
          p.frontmatter.title = getFirstMarkdownTitle(p.src || "")
          p.frontmatter.datetime = new Date(p.frontmatter.date)
          p.frontmatter.readingTime = rt.text
          p.frontmatter.words = rt.words
          p.frontmatter.mdpath = mdpath
          return p;
        })
        .filter(p => !isProduction() || !p.frontmatter.draft)
        .sort((a, b) => b.frontmatter.datetime - a.frontmatter.datetime)
    }
  });
};

export default await getPostFormatter()
