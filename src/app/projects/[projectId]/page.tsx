const ProjectIdPage = async ({
    params,
}: {
    params: Promise<{ projectId: string; }>;
}) => {
    const { projectId } = await params;

    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <h1 className="text-2xl font-bold">Project ID: {projectId}</h1>
        </div>
    );
};

export default ProjectIdPage;