import {defineConfig} from 'vitepress'
import { head } from './configs'
import MarkdownPreview from 'vite-plugin-markdown-preview'

function getNav(locale: string) {
    let map ={
        zh: {
            home: '首页',
            examples: '示例'
        },
        en: {
            home: 'Home',
            examples: 'Examples'
        }
    }
    return [
        {text: map[locale]['home'], link: `/${locale}/`},
        {text: map[locale]['examples'], link: `/${locale}/markdown-examples`}
    ]
}

function getSidebar(locale: string) {
    return [
        {
            text: 'Examples',
            items: [
                {text: 'Markdown Examples', link: `/${locale}/markdown-examples`},
                {text: 'Runtime API Examples', link: `/${locale}/api-examples`}
            ]
        }
    ]
}

function getComment(locale: string) {
    return {
        repo: 'JasonXuDeveloper/Nino',
        repoId: 'R_kgDOHOxiXQ',
        mapping: 'number',
        term: '122',
        reactionsEnabled: true,
        emitMetadata: false,
        inputPosition: 'top',
        lang: locale,
        loading: 'lazy',
        crossorigin: 'anonymous',
    }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
                comment: getComment('en')
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
                comment: getComment('zh-CN')
            }
        }
    },
    themeConfig: {
        editLink: {
            pattern: 'https://github.com/JasonXuDeveloper/Nino.Docs/edit/main/src/:path'
        },
        search: {
            provider: 'algolia',
            options: {
                appId: 'UUCETICZ00',
                apiKey: 'ba3dc36e88d8d3922e3abc1c58407edf',
                indexName: 'nino'
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
})
