import { useFile } from "@/features/projects/hooks/use-files";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "../hooks/use-editor";
import { FileBreadcrumbs } from "./file-breadcrumbs";
import { TopNavigation } from "./top-navigator";
import Image from "next/image";


export const EditorView = ({ projectId }: { projectId: Id<"projects">; }) => {
    const { activeTabId } = useEditor(projectId);
    const activeFile = useFile(activeTabId);

    const isActiveFileText = activeFile && !activeFile.storageId;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center">
                <TopNavigation projectId={projectId} />
            </div>
            {activeTabId && <FileBreadcrumbs projectId={projectId} />}
            <div className="flex-1 min-h-0 bg-background">
                {!activeFile && (
                    <div className="size-full flex items-center justify-center">
                        <Image
                            src="/logo-alt.svg"
                            alt="Polaris"
                            width={50}
                            height={50}
                            className="opacity-25"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};