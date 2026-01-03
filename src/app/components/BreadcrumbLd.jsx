import React from 'react';

/**
 * BreadcrumbLd – renders a JSON‑LD BreadcrumbList for SEO.
 * `items` should be an array of objects with `name` and `url`.
 */
export default function BreadcrumbLd({ items = [] }) {
    if (!items.length) return null;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
