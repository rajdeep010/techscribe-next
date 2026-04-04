import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { expertsData } from "@/lib/template-data";



export function ExpertsSection() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Top Assignment Experts</h2>
                    <div className="text-muted-foreground">
                        Work with specialists from top universities worldwide.
                    </div>
                </div>
                <Button variant="outline" className="hidden sm:inline-flex">View All Experts</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {expertsData.map((expert) => (
                    <Card key={expert.name} className="overflow-hidden">
                        <CardHeader className="flex flex-row gap-4 items-center">
                            <Image
                                src={expert.image}
                                alt={expert.name}
                                width={56}
                                height={56}
                                className="rounded-full"
                            />
                            <div>
                                <div className="font-semibold">{expert.name}</div>
                                <div className="text-sm text-muted-foreground">{expert.profession}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm text-muted-foreground">{expert.about}</div>
                            <div className="flex items-center gap-2 text-sm">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{expert.rating}</span>
                                <span className="text-muted-foreground">• {expert.orders} orders</span>
                            </div>
                            <Button className="w-full">Hire Expert</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}