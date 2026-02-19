import { Button } from "@/components/ui/button";
import { Facebook, InstagramIcon, LinkedinIcon, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background text-foreground py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold">Assignment Help</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="hover:underline">C++ Assignment Help</a></li>
                            <li><a href="#" className="hover:underline">Java Assignment Help</a></li>
                            <li><a href="#" className="hover:underline">Python Assignment Help</a></li>
                            <li><a href="#" className="hover:underline">Data Science Help</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="hover:underline">About Us</a></li>
                            <li><a href="#" className="hover:underline">Contact Us</a></li>
                            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                            <li><a href="#" className="hover:underline">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Connect with Us</h3>
                        <div className="mt-4 flex space-x-4">
                            <a href="#" aria-label="Facebook">
                                <Facebook className="h-6 w-6 text-primary" />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <Twitter className="h-6 w-6 text-primary" />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <InstagramIcon className="h-6 w-6 text-primary" />
                            </a>
                            <a href="#" aria-label="LinkedIn">
                               <LinkedinIcon className="h-6 w-6 text-primary" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-10 border-t pt-6 text-center">
                    <p className="text-sm">© {new Date().getFullYear()} TechScribe. All rights reserved.</p>
                    <Button variant="outline" className="mt-4">Get Started</Button>
                </div>
            </div>
        </footer>
    );
}