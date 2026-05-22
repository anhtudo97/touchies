"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const projects = useQuery(api.projects.get, {});
  const create = useMutation(api.projects.create);

  const handleCreateProject = async () => {
    await create({ name: "New Project" });
  };

  return (
    <div className="flex flex-col gap-2 p-4">

      <Button onClick={handleCreateProject}>
        Create Project
      </Button>

      {
        projects?.map((project) => (
          <div key={project._id} className="p-4 border rounded">
            <h2 className="text-lg font-bold">{project.name}</h2>
            <p>Owner ID: {project.ownerId}</p>
            <p>Import Status: {project.importStatus || "N/A"}</p>
          </div>
        ))
      }
    </div>
  );
}
