import "dotenv/config"
import { env } from "process"
import * as path from "path"

export const BASE_PATH = env.BASE_PATH || undefined;

export const withBaseURL = urlPath => {
  if (BASE_PATH && urlPath.includes(BASE_PATH)) {
    return urlPath
  }
  return path.join(BASE_PATH || "/", urlPath)
}

export const isProduction = () => !BASE_PATH

/**
 * github 评论 接入
 */
export const giscusConfig = {
  category_id: env.GISCUS_CATEGORY_ID || "",
  repo_id: env.GISCUS_REPO_ID || ""
}

/**
 * ga 接入
 */
export const gMeasurementID = env.G_MEASUREMENT_ID || "";
const scriptGTag = [
  "script",
  {
    async: "async",
    src: `https://www.googletagmanager.com/gtag/js?id=${gMeasurementID}`
  },
]

const scriptGTagData = [
  "script",
  {},
  `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gMeasurementID}');`
]

export const gaConfig = [scriptGTag, scriptGTagData]