"use client";

import Image from "next/image";

const countries = [
    { code: "gb", name: "UK" },
    { code: "us", name: "USA" },
    { code: "ca", name: "Canada" },
    { code: "au", name: "Australia" },
    { code: "ie", name: "Ireland" },
    { code: "de", name: "Germany" },
    { code: "nz", name: "New Zealand" },
    { code: "ae", name: "UAE" },
];

export function CountryFlagsSwiper() {
    const marqueeFlags = [...countries, ...countries];

    return (
        <section className="mx-auto max-w-6xl overflow-hidden px-4 sm:px-6">
            <div className="overflow-hidden py-4">
                <div className="flag-marquee-track" aria-label="Countries we support">
                    {marqueeFlags.map((country, index) => (
                        <div key={`${country.code}-${index}`} className="flag-card">
                            <Image
                                src={`https://flagcdn.com/w320/${country.code}.png`}
                                alt={`${country.name} flag`}
                                width={176}
                                height={112}
                                loading="lazy"
                                className="h-24 w-38 rounded-md object-cover sm:h-28 sm:w-44"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .flag-marquee-track {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    width: max-content;
                    animation: country-marquee 22s linear infinite;
                    will-change: transform;
                    pointer-events: none;
                    user-select: none;
                }

                .flag-card {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 18rem;
                    min-height: 14rem;
                    border-radius: 1rem;
                }

                @keyframes country-marquee {
                    from {
                        transform: translate3d(0, 0, 0);
                    }
                    to {
                        transform: translate3d(-50%, 0, 0);
                    }
                }
            `}</style>
        </section>
    );
}