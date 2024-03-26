// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import './style.css'
import Home from "./pages/Home.vue";
import Guide from "./pages/Guide.vue";
import Posts from "./pages/Posts.vue";
import Tags from "./pages/Tags.vue";
import Archives from "./pages/Archives.vue";
import About from "./pages/About.vue";
import Layout from "./pages/Layout.vue";
import PostElements from "./components/PostElements.vue";


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("Home", Home);
    app.component("Guide", Guide);
    app.component("Posts", Posts);
    app.component("Archives", Archives);
    app.component("Tags", Tags);
    app.component("PostElements", PostElements);
    app.component("About", About);
  },
};

