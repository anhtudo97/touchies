"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { UserButton } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Id } from "../../../../convex/_generated/dataModel";
import { useProject } from "../hooks/use-projects";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const Navbar = ({
    projectId
}: {
    projectId: Id<"projects">;
}) => {
    const project = useProject(projectId);

    return (
        <nav className="flex justify-between items-center gap-x-2 p-2 bg-sidebar border-b">
            <div className="flex items-center gap-x-2">
                <Breadcrumb>
                    <BreadcrumbList className="gap-0!">
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                className="flex items-center gap-1.5"
                                asChild
                            >
                                <Button
                                    variant="ghost"
                                    className="w-fit! p-1.5! h-7!"
                                    asChild
                                >
                                    <Link href="/">
                                        <Image
                                            src="/logo.svg"
                                            alt="Logo"
                                            width={20}
                                            height={20}
                                        />
                                        <span
                                            className={cn(
                                                "text-sm font-medium",
                                                font.className,
                                            )}
                                        >
                                            Touchies
                                        </span>
                                    </Link>
                                </Button>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="ml-0! mr-1" />
                        <BreadcrumbItem>
                            <BreadcrumbPage
                                className="text-sm cursor-pointer hover:text-primary font-medium max-w-40 truncate"
                            >
                                {project?.name ?? "Loading..."}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {project?.importStatus === "importing" ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
                        </TooltipTrigger>
                        <TooltipContent>Importing...</TooltipContent>
                    </Tooltip>
                ) : (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CloudCheckIcon className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Saved{" "}
                            {project?.updatedAt
                                ? formatDistanceToNow(
                                    project.updatedAt,
                                    { addSuffix: true, }
                                )
                                : "Loading..."}
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            <div className="flex items-center gap-2">
                <UserButton />
            </div>
        </nav>
    );
};