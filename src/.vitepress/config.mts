import { head } from './configs'
import { MarkdownPreview } from 'vite-plugin-markdown-preview'
import { withMermaid } from "vitepress-plugin-mermaid";
import { defineConfig } from "vitepress";

let map = {
    zh: {
        home: '首页',
        doc: '使用文档',
        start: '快速开始',
        types: '类型系统',
        basic: '基础用法',
        advanced: '进阶用法',
        limit: '限制',
        perf: '性能测试',
        perf_micro: '微基准测试',
        versioning: '版本迭代',
    },
    en: {
        home: 'Home',
        doc: 'Documentation',
        start: 'Quick Start',
        types: 'Type System',
        basic: 'Basic Usage',
        advanced: 'Advanced Usage',
        limit: 'Limitation',
        perf: 'Performance',
        perf_micro: 'Microbenchmark',
        versioning: 'Versioning',
    }
}

function getNav(locale: string) {
    const ret = [
        { text: map[locale]['home'], link: `/${locale}/` },
        {
            text: map[locale]['doc'],
            items: [
                { text: map[locale]['start'], link: `/${locale}/doc/start` },
                { text: map[locale]['versioning'], link: `/${locale}/doc/versioning` },
                { text: map[locale]['types'], link: `/${locale}/doc/types` },
                { text: map[locale]['basic'], link: `/${locale}/doc/basic` },
                { text: map[locale]['advanced'], link: `/${locale}/doc/advanced` },
                { text: map[locale]['limit'], link: `/${locale}/doc/limit` }
            ]
        },
        {
            text: map[locale]['perf'],
            items: [
                { text: map[locale]['perf_micro'], link: `/${locale}/perf/micro` }
            ]
        },
        {
            text: 'v3.x',
            items: [
                { text: 'v2.x', link: 'https://v2.nino.xgamedev.net' }
            ]
        }
    ]

    if (locale === 'zh') {
        ret.push({
            text: '交流群',
            link: 'https://qm.qq.com/q/Octgj3BS8g'
        })
    }

    return ret
}

function getSidebar(locale: string) {
    return [
        {
            text: map[locale]['doc'],
            items: [
                {
                    text: map[locale]['start'],
                    link: `/${locale}/doc/start`
                },
                {
                    text: map[locale]['versioning'],
                    link: `/${locale}/doc/versioning`
                },
                {
                    text: map[locale]['types'],
                    link: `/${locale}/doc/types`
                },
                {
                    text: map[locale]['basic'],
                    link: `/${locale}/doc/basic`
                },
                {
                    text: map[locale]['advanced'],
                    link: `/${locale}/doc/advanced`
                },
                {
                    text: map[locale]['limit'],
                    link: `/${locale}/doc/limit`
                }
            ]
        },
        {
            text: map[locale]['perf'],
            items: [
                {
                    text: map[locale]['perf_micro'],
                    link: `/${locale}/perf/micro`
                }
            ]
        }
    ]
}

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
    title: "Nino",
    lastUpdated: true,
    cleanUrls: true,
    lang: "en",
    head,
    logo: '/logo.png',
    /* markdown 配置 */
    markdown: {
        lineNumbers: true,
    },
    locales: {
        root: {
            label: 'English',
            lang: 'en',
            description: 'Ultimate high-performance binary serialization library for C#.',
            link: '/en/',
            themeConfig: {
                nav: getNav('en'),
                sidebar: getSidebar('en'),
                outline: {
                    level: 'deep',
                    label: 'Table of Contents',
                },
            }
        },
        zh: {
            label: '中文',
            lang: 'zh',
            description: '终极高性能C#二进制序列化库。',
            link: '/zh/',
            themeConfig: {
                nav: getNav('zh'),
                sidebar: getSidebar('zh'),
                outline: {
                    level: 'deep',
                    label: '目录',
                },
                lastUpdated: {
                    text: '最后更新于',
                    formatOptions: {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                    },
                },
                docFooter: {
                    prev: '上一篇',
                    next: '下一篇',
                },
                editLink: {
                    text: '在 GitHub 上编辑此页',
                    pattern: 'https://github.com/JasonXuDeveloper/Nino.Docs/edit/main/src/:path'
                },
                returnToTopLabel: '回到顶部',
                sidebarMenuLabel: '菜单',
                darkModeSwitchLabel: '主题',
                lightModeSwitchTitle: '切换到浅色模式',
                darkModeSwitchTitle: '切换到深色模式',
            }
        }
    },
    themeConfig: {
        editLink: {
            pattern: 'https://github.com/JasonXuDeveloper/Nino.Docs/edit/main/src/:path'
        },
        comment: {
            repo: 'JasonXuDeveloper/Nino',
            repoId: 'R_kgDOHOxiXQ',
            category: 'General',
            categoryId: 'DIC_kwDOHOxiXc4CgstZ',
        },
        search: {
            provider: 'algolia',
            options: {
                appId: 'UUCETICZ00',
                apiKey: 'ba3dc36e88d8d3922e3abc1c58407edf',
                indexName: 'nino',
                locales: {
                    zh: {
                        placeholder: '搜索文档',
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                searchBox: {
                                    resetButtonTitle: '清除查询条件',
                                    resetButtonAriaLabel: '清除查询条件',
                                    cancelButtonText: '取消',
                                    cancelButtonAriaLabel: '取消'
                                },
                                startScreen: {
                                    recentSearchesTitle: '搜索历史',
                                    noRecentSearchesText: '没有搜索历史',
                                    saveRecentSearchButtonTitle: '保存至搜索历史',
                                    removeRecentSearchButtonTitle: '从搜索历史中移除',
                                    favoriteSearchesTitle: '收藏',
                                    removeFavoriteSearchButtonTitle: '从收藏中移除'
                                },
                                errorScreen: {
                                    titleText: '无法获取结果',
                                    helpText: '你可能需要检查你的网络连接'
                                },
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭',
                                    searchByText: '搜索提供者'
                                },
                                noResultsScreen: {
                                    noResultsText: '无法找到相关结果',
                                    suggestedQueryText: '你可以尝试查询',
                                    reportMissingResultsText: '你认为该查询应该有结果？',
                                    reportMissingResultsLinkText: '点击反馈'
                                }
                            }
                        }
                    }
                }
            }
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/JasonXuDeveloper/Nino' }
        ],
        footer: {
            // message: 'Released under the MIT License.',
            copyright: 'Copyright © 2022-present JasonXuDeveloper'
        }
    },
    vite: {
        plugins: [MarkdownPreview()],
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ["legacy-js-api"],
                    api: 'modern-compiler' // or "modern"
                }
            }
        },
        optimizeDeps: {
            include: [
                'mermaid'
            ]
        }
    },
    sitemap: {
        hostname: 'https://nino.xgamedev.net'
    },
}))
