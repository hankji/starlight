// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// import rehypeAstroRelativeMarkdownLinks from "astro-rehype-relative-markdown-links";

// const options = {
//   contentPath: 'src/content/docs/docs',
//   collections: {
//     docs: {
//       base: false
//     }
//   }
// };

// https://astro.build/config
export default defineConfig({
	// markdown: {
	// 	rehypePlugins: [[rehypeAstroRelativeMarkdownLinks, options]],
	//   },
	site: 'https://k.weekim.com',
	integrations: [
		starlight({
			title: '知识库随笔',
			social: {
				github: 'https://github.com/hankji',
				'x.com': 'https://x.com/hank_dream',
			},
			locales: {
				root: {
				  label: '简体中文',
				  lang: 'zh-CN', // lang 是 root 语言必须的
				},
			  },
			sidebar: [
				{ label: 'Linux',collapsed: true, autogenerate: { directory: 'knowledge' } },
				{ label: 'Develop',collapsed: true, autogenerate: { directory: 'developer' } },
				{ label: 'ads', collapsed: true, autogenerate: { directory: 'ads' } },
				{ label: 'other', collapsed: true, autogenerate: { directory: 'other' } },
				{ label: 'Nav导航', link: 'https://nav.weekim.com/' },
				{ label: 'Tools', link: 'https://tools.weekim.com/' },
			],
		}),
	],
});
