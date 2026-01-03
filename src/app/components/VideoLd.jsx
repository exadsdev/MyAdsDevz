import React from "react";

/**
 * VideoLd – renders a schema.org VideoObject JSON‑LD script.
 * Expects a `video` object with fields: title, excerpt, thumbnail, date, duration, youtube,
 * transcript, keywords (array), author, views, etc.
 */
export default function VideoLd({ video }) {
    if (!video) return null;

    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const pageUrl = `${base}/videos/${video.slug}`;

    // Ensure thumbnail is an absolute URL
    let thumb = video.thumbnail || "/og-default.jpg";
    if (!thumb.startsWith("http")) {
        if (!thumb.startsWith("/")) thumb = `/${thumb}`;
        thumb = `${base}${thumb}`;
    }

    // Build YouTube embed URL (accepts ID or full URL)
    let embedUrl = "";
    if (video.youtube) {
        const s = String(video.youtube).trim();
        embedUrl = s.startsWith("http") ? s : `https://www.youtube.com/watch?v=${s}`;
    }

    // Helper: seconds → ISO‑8601 duration (PT…S)
    const formatDuration = (seconds) => {
        if (!seconds) return undefined;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `PT${h > 0 ? `${h}H` : ""}${m > 0 ? `${m}M` : ""}${s > 0 ? `${s}S` : ""}`;
    };

    // Helper: date → ISO‑8601 (YYYY‑MM‑DD)
    const formatDate = (dateStr) => {
        if (!dateStr) return undefined;
        const d = new Date(dateStr);
        if (isNaN(d)) return undefined;
        return d.toISOString().split('T')[0];
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.title || "",
        description: video.excerpt || video.title || "",
        thumbnailUrl: thumb,
        uploadDate: formatDate(video.date),
        duration: formatDuration(video.duration),
        contentUrl: pageUrl,
        embedUrl: embedUrl,
        transcript: video.transcript || undefined,
        keywords: video.keywords?.join(', ') || undefined,
        author: video.author ? { "@type": "Person", name: video.author } : undefined,
        publisher: {
            "@type": "Organization",
            name: process.env.NEXT_PUBLIC_SITE_NAME || "My Site",
            logo: {
                "@type": "ImageObject",
                url: `${base}/logo.png`
            }
        },
        interactionStatistic: video.views ? {
            "@type": "InteractionCounter",
            interactionType: { "@type": "WatchAction" },
            userInteractionCount: video.views
        } : undefined,
    };

    // Strip undefined / null values
    Object.keys(jsonLd).forEach((k) => {
        if (jsonLd[k] === undefined || jsonLd[k] === null) delete jsonLd[k];
    });

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
