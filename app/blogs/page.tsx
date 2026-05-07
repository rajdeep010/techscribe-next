import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PublicBlogsClient } from "@/components/landing/public-blogs-client";
import { PublicBlogsProvider } from "@/context/PublicBlogsProvider";
import { getPublicBlogs } from "@/lib/public-blog";

export default async function BlogsPage() {
    const blogs = await getPublicBlogs();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main>
                <PublicBlogsProvider initialBlogs={blogs}>
                    <PublicBlogsClient />
                </PublicBlogsProvider>
            </main>

            <Footer />
        </div>
    );
}