import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { label: "Total Orders", value: "24", subLabel: "Orders", icon: FileText, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950" },
    { label: "In Progress", value: "5", subLabel: "Orders", icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-950" },
    { label: "Completed", value: "19", subLabel: "Orders", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950" },
    { label: "Cancelled", value: "2", subLabel: "Orders", icon: TrendingUp, color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-950" },
];

export function UserProfileSection() {
    return (
        <Card>
            <CardContent className="space-y-4">
                {/* User Profile Info */}
                <div className="flex items-start gap-6">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="text-xl font-semibold">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-xl font-bold mb-4">John Doe</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm">
                            <div>
                                <p className="text-muted-foreground">ID</p>
                                <p className="font-medium">ID: 2021-0001</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Number</p>
                                <p className="font-medium">(555) 123-4567</p>
                        </div>
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium">john.doe@gmail.com</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Address</p>
                                <p className="font-medium">123 Elm Street</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className={cn(
                                    "rounded-xl p-4 transition-all",
                                    stat.bgColor
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn("rounded-full p-2.5 bg-background/50")}>
                                        <Icon className={cn("h-5 w-5", stat.color)} />
                                    </div>
                                    <div className="flex -gap-0.5 flex-col flex-1">
                                        <p className="text-xl font-bold mb-1">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}