import {head} from './configs'
import MarkdownPreview from 'vite-plugin-markdown-preview'
import {withMermaid} from "vitepress-plugin-mermaid";
import {defineConfig} from "vitepress";

function getNav(locale: string) {
    let map = {
        zh: {
            home: '首页',
            start: '使用文档',
            perf: '性能测试',
            perf_micro: '微基准测试',
        },
        en: {
            home: 'Home',
            start: 'Documentation',
            perf: 'Performance',
            perf_micro: 'Microbenchmark',
        }
    }
    return [
        {text: map[locale]['home'], link: `/${locale}/`},
        {text: map[locale]['start'], link: `/${locale}/start`},
        {
            text: map[locale]['perf'],
            items: [
                {text: map[locale]['perf_micro'], link: `/${locale}/perf/micro`}
            ]
        },
    ]
}

function getSidebar(locale: string) {
    let map = {
        zh: {
            start: '使用文档',
            perf: '性能测试',
            perf_micro: '微基准测试',
        },
        en: {
            start: 'Documentation',
            perf: 'Performance',
            perf_micro: 'Microbenchmark',
        }
    }
    return [
        {
            text: map[locale]['start'],
            link: `/${locale}/start`,
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
    description: "Definite useful and high performance serialization library for any C# projects, including but not limited to .NET Core apps or Unity/Godot games.",
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
            {icon: 'github', link: 'https://github.com/JasonXuDeveloper/Nino'}
        ],
        footer: {
            // message: 'Released under the MIT License.',
            copyright: 'Copyright © 2022-present JasonXuDeveloper'
        }
    },
    vite: {
        plugins: [MarkdownPreview()],
    },
    sitemap: {
        hostname: 'https://nino.xgamedev.net'
    }
}))
