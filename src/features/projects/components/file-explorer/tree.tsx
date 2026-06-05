import { useState } from "react";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { useCreateFile, useCreateFolder, useDeleteFile, useFolderContents, useRenameFile } from "../../hooks/use-files";

export const Tree = ({
    item,
    level = 0,
    projectId,
}: {
    item: Doc<"files">;
    level?: number;
    projectId: Id<"projects">;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [creating, setCreating] = useState<"file" | "folder" | null>(null);

    const renameFile = useRenameFile({
        projectId,
        parentId: item.parentId,
    });
    const deleteFile = useDeleteFile({
        projectId,
        parentId: item.parentId,
    });
    const createFile = useCreateFile();
    const createFolder = useCreateFolder();

    const folderContents = useFolderContents({
        projectId,
        parentId: item._id,
        enabled: item.type === "folder" && isOpen,
    });

    if (item.type === "file") {
        return (
            <div>
                Iam a file
            </div>
        );
    }

    return (
        <div>
            Iam a folder
        </div>
    );
};