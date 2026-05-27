import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useProjectsPartial } from "./hooks/use-projects";

interface ProjectsListProps {
    onViewAll: () => void;
}

export const ProjectsList = ({ onViewAll }: ProjectsListProps) => {
    const projects = useProjectsPartial(6);

    if (!projects) {
        return <Spinner className="size-4 text-ring" />;
    }

    // const [mostRecent, ...rest] = projects;

    return (
        <div className="flex flex-col gap-4">
            {projects.length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                            Recent projects
                        </span>
                        <button
                            onClick={onViewAll}
                            className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors"
                        >
                            <span>View all</span>
                            <Kbd className="bg-accent border">
                                ⌘K
                            </Kbd>
                        </button>
                    </div>
                    <ul className="flex flex-col">
                        {projects.map((project) => (
                            <ProjectItem key={project._id} data={project} />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true
    });
};

const getProjectIcon = (project: Doc<"projects">) => {
    if (project.importStatus === "completed") {
        return <FaGithub className="size-3.5 text-muted-foreground" />;
    }

    if (project.importStatus === "failed") {
        return <AlertCircleIcon className="size-3.5 text-muted-foreground" />;
    }

    if (project.importStatus === "importing") {
        return (
            <Loader2Icon className="size-3.5 text-muted-foreground animate-spin" />
        );
    }

    return <GlobeIcon className="size-3.5 text-muted-foreground" />;
};

const ProjectItem = ({
    data
}: {
    data: Doc<"projects">;
}) => {
    return (
        <Link
            href={`/projects/${data._id}`}
            className="text-sm text-foreground/60 font-medium hover:text-foreground py-1 flex items-center justify-between w-full group"
        >
            <div className="flex items-center gap-2">
                {getProjectIcon(data)}
                <span className="truncate">{data.name}</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
                {formatTimestamp(data.updatedAt)}
            </span>
        </Link>
    );
};