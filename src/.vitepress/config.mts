import {defineConfig} from 'vitepress'

function getNav(locale: string) {
    return [
        {text: 'Home', link: `/${locale}/`},
        {text: 'Examples', link: `/${locale}/markdown-examples`}
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

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Nino",
    description: "Definite useful and high performance serialization library for any C# projects, including but not limited to .NET Core apps or Unity/Godot games.",
    lastUpdated: true,
    locales: {
        root: {
            label: 'English',
            lang: 'en',
            link: '/en/',
            themeConfig: {
                nav: getNav('en'),
                sidebar: getSidebar('en')
            }
        },
        zh: {
            label: 'Chinese',
            lang: 'zh',
            link: '/zh/',
            themeConfig: {
                nav: getNav('zh'),
                sidebar: getSidebar('zh')
            }
        }
    },
    themeConfig: {
        editLink: {
            pattern: 'https://github.com/JasonXuDeveloper/Nino.Docs/edit/main/src/:path'
        },
        // search: {
        //     provider: 'algolia',
        //     options: {
        //         appId: 'KJ8V1HNDLE',
        //         apiKey: 'd612e4a15dec2901360d263a657b7dde',
        //         indexName: 'nino'
        //     }
        // },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/JasonXuDeveloper/Nino'}
        ]
    }
})
