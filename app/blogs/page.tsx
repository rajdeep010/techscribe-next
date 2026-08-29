import Image from "next/image";
import { BookOpenText, PenSquare, Sparkles } from "lucide-react";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { HeroBanner } from "@/components/landing/hero-banner";
import { PublicBlogsClient } from "@/components/landing/public-blogs-client";
import { PublicBlogsProvider } from "@/context/PublicBlogsProvider";
import { getPublicBlogs } from "@/lib/public-blog";

export default async function BlogsPage() {
    let blogs: Awaited<ReturnType<typeof getPublicBlogs>> = [];

    try {
        blogs = await getPublicBlogs();
    } catch (error) {
        console.error("Failed to load public blogs", error);
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <HeroBanner
                align="split"
                title="Insights & Guides for Academic Success"
                description="Practical tips on research, referencing, dissertations, and academic writing — straight from our team of subject experts."
                trustBadges={[
                    { icon: BookOpenText, label: "Expert-Written Guides" },
                    { icon: PenSquare, label: "Updated Regularly" },
                    { icon: Sparkles, label: "Free to Read" },
                ]}
                media={
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                        <Image
                            src="/group1-vert.jpg"
                            alt="Students collaborating on academic research"
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                }
            />

            <main>
                <PublicBlogsProvider initialBlogs={blogs}>
                    <PublicBlogsClient />
                </PublicBlogsProvider>
            </main>

            <Footer />
        </div>
    );
}