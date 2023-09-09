export const siteConfig = {
  author: 'Tycho',
  title: 'Tycho - Blog',
  description: 'My blog site.',
  lang: 'zh-CN',
}

export const subNavLinks = [
  {
    title: 'Blog',
    path: '/blog',
  },
  {
    title: 'Record',
    path: '/record',
  },
]

export const navLinks = [
  {
    title: '文章',
    path: '/blog',
    icon: 'i-icon-park-outline-align-text-right-one',
  },
  // {
  //   title: '项目',
  //   path: '/projects',
  //   icon: 'i-icon-park-outline-blocks-and-arrows',
  // },
  {
    title: '标签',
    path: '/tags',
    icon: 'i-icon-park-outline-tag-one',
  },
  {
    title: '搜索',
    path: '/search',
    icon: 'i-icon-park-outline-search',
  },
  {
    title: '关于',
    path: '/',
    icon: 'i-icon-park-outline-grinning-face-with-open-mouth',
  },

]

export const socialLinks = [
  {
    title: '掘金',
    path: 'https://juejin.cn/user/4244581912153134',
    icon: 'i-simple-icons-juejin',
  },
  {
    title: 'Github',
    path: 'https://github.com/Tycho457',
    icon: 'i-icon-park-outline-github',
  },
]

export const projectList = [
  {
    name: 'Recent Projects',
    content: [
      {
        name: 'Zeal UI',
        desc: 'components store, base on Vue3 and Ts',
        path: 'https://github.com/chansee97/zeal-ui',
      },
    ],
  },
  {
    name: 'Projects',
    content: [
      {
        name: 'Nuxt Blog',
        desc: 'My blog site, base on Nuxt',
        path: 'https://github.com/chansee97/nuxt-blog',
      },
      {
        name: 'Nova Admin',
        desc: 'a complete admin template',
        path: 'https://github.com/chansee97/nova-admin',
      },
      {
        name: 'Nova Admin Nest',
        desc: 'The nest backend for nova admin',
        path: 'https://github.com/chansee97/nove-admin-nest',
      },
    ],
  },
  {
    name: 'Configuration',
    content: [
      {
        name: 'lint-config',
        desc: 'My configuration with eslint, stylelint, commentslint',
        path: 'https://github.com/chansee97/lint-config',
      },
      {
        name: 'dotfiles',
        desc: 'My personal development configuration',
        path: 'https://github.com/chansee97/dotfiles',
      },
    ],
  },
  {
    name: 'Starter',
    content: [
      {
        name: 'Virtuoso',
        desc: 'My simply vue starter',
        path: 'https://github.com/chansee97/virtuoso',
      },
    ],
  },
]
