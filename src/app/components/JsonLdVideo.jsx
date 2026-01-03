// This component generates JSON-LD structured data for a video, including hasPart (Clip) entries based on chapters.
import React from "react";

/** Accepts: HH:MM:SS, MM:SS, or SS  */
function timecodeToSeconds(tc = "") {
    const t = String(tc).trim();
    if (!t) return null;
    const parts = t.split(":").map((x) => Number(x));
    if (parts.some((n) => Number.isNaN(n))) return null;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
    return null;
}

/** Best-effort strip html -> plain text */
function htmlToText(html = "") {
    return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function JsonLdVideo({ video }) {
    if (!video) return null;

    const {
        title,
        excerpt,
        description, // allow either
        thumbnail,
        duration,
        uploadDate,
        author,
        transcriptHtml,
        keywords = [],
        chapters = [],
        contentUrl,
        // optional: url of this page (recommended to pass)
        url,
    } = video;

    const desc = String(description || excerpt || "").trim();

    // Build hasPart array from chapters if available
    const normalized = Array.isArray(chapters) ? chapters : [];
    const hasPartRaw = normalized
        .filter((c) => c?.t && c?.label)
        .map((c) => ({
            t: String(c.t).trim(),
            label: String(c.label).trim(),
            startOffset: timecodeToSeconds(c.t),
        }))
        .filter((x) => x.label && typeof x.startOffset === "number")
        .sort((a, b) => a.startOffset - b.startOffset);

    // Add endOffset by next chapter startOffset (optional)
    const hasPart = hasPartRaw.map((x, idx) => {
        const next = hasPartRaw[idx + 1];
        const clip = {
            "@type": "Clip",
            name: x.label,
            startOffset: x.startOffset,
        };
        if (next && typeof next.startOffset === "number" && next.startOffset > x.startOffset) {
            clip.endOffset = next.startOffset;
        }
        // If you pass the page URL, we can add a fragment as a best practice
        if (url) {
            clip.url = `${url}#t=${x.startOffset}`;
        }
        return clip;
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title || "",
        description: desc || "",
        thumbnailUrl: thumbnail || "",
        duration: duration || "PT0M",
        uploadDate: uploadDate || undefined,
        author: author
            ? {
                "@type": "Person",
                name: author,
            }
            : undefined,
        transcript: transcriptHtml ? htmlToText(transcriptHtml) : undefined,
        keywords: Array.isArray(keywords) ? keywords.join(", ") : String(keywords || ""),
        hasPart: hasPart.length ? hasPart : undefined,
        contentUrl: contentUrl || undefined,
        url: url || undefined,
    };

    // Remove undefined fields
    Object.keys(jsonLd).forEach((k) => jsonLd[k] === undefined && delete jsonLd[k]);

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
