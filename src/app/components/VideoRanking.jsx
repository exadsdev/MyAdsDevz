"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * VideoRanking – fetches videos and displays the top N based on view count (or newest if no views).
 * Adjust `MAX_ITEMS` as needed.
 */
export default function VideoRanking({ maxItems = 6 }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch("/api/videos", { cache: "no-store" })
            .then((r) => r.json())
            .then((data) => {
                const items = Array.isArray(data.items) ? data.items : [];
                // Sort by view count descending, fallback to newest date
                const sorted = items.sort((a, b) => {
                    const aViews = a.views ?? 0;
                    const bViews = b.views ?? 0;
                    if (aViews !== bViews) return bViews - aViews;
                    // If view counts equal, compare dates (newest first)
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setVideos(sorted.slice(0, maxItems));
            })
            .catch(() => setVideos([]));
    }, [maxItems]);

    if (!videos.length) return null;

    return (
        <section className="video-ranking my-5">
            <h2 className="h4 mb-4 text-center">วิดีโอที่ได้รับความนิยมสูงสุด</h2>
            <div className="row g-3 justify-content-center">
                {videos.map((v) => (
                    <div key={v.slug} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <Link href={`/videos/${v.slug}`} className="text-decoration-none">
                            <div className="card h-100 shadow-sm">
                                {/* Use Next.js Image for optimized loading */}
                                <Image
                                    src={v.thumbnail}
                                    alt={v.title}
                                    width={320}
                                    height={180}
                                    className="card-img-top"
                                    style={{ objectFit: "cover" }}
                                />
                                <div className="card-body p-2">
                                    <p className="card-title mb-1 text-truncate" title={v.title}>
                                        {v.title}
                                    </p>
                                    {v.views !== undefined && (
                                        <small className="text-muted d-block">
                                            👁️ {v.views.toLocaleString()} views
                                        </small>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
