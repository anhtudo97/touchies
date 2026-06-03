import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, FilePlusCornerIcon } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState } from "react";
import { useProject } from "../../hooks/use-projects";
import { Button } from "@/components/ui/button";

export const FileExplorer = ({
    projectId
}: {
    projectId: Id<"projects">;
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [creating, setCreating] = useState<"file" | "folder" | null>(
        null
    );


    const project = useProject(projectId);

    return (
        <div className="h-full bg-sidebar">
            <ScrollArea>
                <div
                    role="button"
                    onClick={() => setIsOpen((value) => !value)}
                    className="group/project cursor-pointer w-full text-left flex items-center gap-0.5 h-5.5 bg-accent font-bold"
                >
                    <ChevronRightIcon
                        className={cn(
                            "size-4 shrink-0 text-muted-foreground",
                            isOpen && "rotate-90"
                        )}
                    />
                    <p className="text-xs uppercase line-clamp-1">
                        {project?.name ?? "Loading..."}
                    </p>
                    <div className="opacity-0 group-hover/project:opacity-100 transition-none duration-0 flex items-center gap-0.5 ml-auto">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsOpen(true);
                                setCreating("file");
                            }}
                            variant="highlight"
                            size="icon-xs"
                        >
                            <FilePlusCornerIcon className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};