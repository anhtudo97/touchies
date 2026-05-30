"use client";

import React from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { Navbar } from './navbar';

interface ProjectIdLayoutProps {
    projectId: Id<"projects">;
    children: React.ReactNode;
}

export const ProjectIdLayout = ({ projectId, children }: ProjectIdLayoutProps) => {
    return (
        <div className="w-full h-screen flex flex-col">
            <Navbar projectId={projectId} />
        </div>
    );
};
