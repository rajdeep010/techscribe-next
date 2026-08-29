import Image from "next/image";
import { SectionHeading } from "./section-heading";

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
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading title="Proudly Supporting Students in" className="mb-6" />
            <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-6">
                {countries.map((country) => (
                    <div key={country.code} className="flex w-16 flex-col items-center gap-2">
                        <Image
                            src={`https://flagcdn.com/w160/${country.code}.png`}
                            alt={`${country.name} flag`}
                            width={64}
                            height={40}
                            loading="lazy"
                            className="h-10 w-16 rounded-md object-cover shadow-sm"
                        />
                        <span className="text-xs font-medium text-muted-foreground">{country.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
