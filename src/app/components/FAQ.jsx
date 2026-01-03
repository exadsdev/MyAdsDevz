import JsonLd from "./JsonLd";

/**
 * FAQ component renders an accordion of questions & answers and injects JSON‑LD for FAQPage.
 * @param {{items: {q:string, a:string}[]}} props
 */
export default function FAQ({ items }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map(({ q, a }) => ({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": a,
            },
        })),
    };

    return (
        <>
            <section className="my-5">
                <h2 className="fw-bold">คำถามที่พบบ่อย</h2>
                <div className="accordion" id="faqAccordion">
                    {items.map((item, i) => (
                        <div className="accordion-item" key={i}>
                            <h3 className="accordion-header" id={`heading${i}`}>
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${i}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${i}`}
                                >
                                    {item.q}
                                </button>
                            </h3>
                            <div
                                id={`collapse${i}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`heading${i}`}
                                data-bs-parent="#faqAccordion"
                            >
                                <div className="accordion-body">{item.a}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* JSON‑LD for FAQ */}
            <JsonLd data={schema} />
        </>
    );
}
