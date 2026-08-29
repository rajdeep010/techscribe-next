import type { ReactNode } from "react";
import { LogoFull } from "@/components/common/logo";

export function AuthBrandPanel({
    title,
    description,
    children,
}: {
    title: ReactNode;
    description: string;
    children?: ReactNode;
}) {
    return (
        <div className="relative hidden h-full w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-violet-950 via-primary to-violet-800 p-12 text-white lg:flex">
            <div className="mx-auto w-full max-w-md space-y-6 text-center">
                <LogoFull width={180} className="mx-auto" />
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="text-base text-white/80">{description}</p>
                {children}
            </div>
        </div>
    );
}
