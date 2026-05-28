"use client";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { SparkleIcon } from "lucide-react";
import { Poppins } from "next/font/google";

import Image from "next/image";

import { FaGithub } from "react-icons/fa";
import { useCreateProject } from "../hooks/use-projects";
import { ProjectsList } from "./projects-list";

import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const ProjectsView = () => {
    const createProject = useCreateProject();

    const handleCreateProject = async () => {
        const projectName = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: " ",
            length: 3,
        });
        await createProject({ name: projectName });
    };

    return (
        <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">

            <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">
                <div className="flex justify-between gap-4 w-full items-center">
                    <div className="flex items-center gap-2 w-full group/logo">
                        <Image
                            src="/vercel.svg"
                            alt="Touchies"
                            className="size-8 md:size-11.5"
                            quality={100}
                            objectFit="cover"
                            width={32}
                            height={32}
                        />
                        <h1 className={cn(
                            "text-4xl md:text-5xl font-semibold",
                            font.className,
                        )}>
                            Polaris
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCreateProject}
                            className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
                        >
                            <div className="flex items-center justify-between w-full">
                                <SparkleIcon className="size-4" />
                                <Kbd className="bg-accent border">
                                    ⌘J
                                </Kbd>
                            </div>
                            <div>
                                <span className="text-sm">
                                    New
                                </span>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => { }}
                            className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
                        >
                            <div className="flex items-center justify-between w-full">
                                <FaGithub className="size-4" />
                                <Kbd className="bg-accent border">
                                    ⌘I
                                </Kbd>
                            </div>
                            <div>
                                <span className="text-sm">
                                    Import
                                </span>
                            </div>
                        </Button>
                    </div>

                    <ProjectsList onViewAll={() => { }} />
                </div>
            </div>
        </div>
    );
};
