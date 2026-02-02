"use client";

import { Sidebar } from "@/components/sidebar";
import { AIChatbot } from "@/components/ai-chatbot";
import { SearchBar } from "@/components/search-bar";
import { NotificationsPanel } from "@/components/notifications-panel";
import { projects, issues, sprints } from "@/lib/demo-data";
import Link from "next/link";
import { BarChart3, Users, Zap } from "lucide-react";

export default function Home() {
  const activeSprint = sprints[0];
  const sprintIssues = issues.filter((i) => activeSprint.issues.includes(i.id));
  const todoCount = issues.filter((i) => i.status === "Todo").length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress",
  ).length;
  const doneCount = issues.filter((i) => i.status === "Done").length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main content */}
      <main className="lg:ml-64 transition-all duration-300">
        {/* Top bar */}
        <header className="sticky top-0 bg-white border-b border-border z-20">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <div className="flex-1 max-w-md">
              <SearchBar />
            </div>
            <div className="flex items-center gap-4">
              <NotificationsPanel />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center">
                SC
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 space-y-8">
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Active Sprint</h3>
                <Zap className="text-primary" size={24} />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {activeSprint.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {sprintIssues.length} issues • Ends Feb 10
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Tasks Status</h3>
                <BarChart3 className="text-accent" size={24} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-bold text-primary">
                    {inProgressCount}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{
                      width: `${(inProgressCount / issues.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* <div className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Team Members</h3>
                <Users className="text-secondary" size={24} />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">8</p>
              <p className="text-sm text-muted-foreground">
                Active contributors
              </p>
            </div> */}
          </div>

          {/* Recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Sprint Progress
              </h3>
              <div className="space-y-4">
                {sprintIssues.slice(0, 5).map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {issue.key}: {issue.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {issue.description}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-md ${
                        issue.status === "Done"
                          ? "bg-green-100 text-green-700"
                          : issue.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Your Projects
              </h3>
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.key.toLowerCase()}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <span className="text-2xl">{project.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.type}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </main>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
