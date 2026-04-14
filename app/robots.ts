import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://journal.tradingmars.com";

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/accounts/', '/strategies/', '/settings/', '/analytics/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
