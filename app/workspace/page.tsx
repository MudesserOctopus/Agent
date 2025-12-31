"use client";

import { useState, useEffect } from "react";
import WorkspaceFilters from "@/app/components/WorkspaceFilters";
import AgentCard from "@/app/components/AgentCard";
import Sidebar from "@/app/components/sidebar";

export default function WorkspacePage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      const userId = localStorage.getItem('userId');
      console.log("##############################",userId);
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/agents?workspace_id=${userId}`);
        const data = await response.json();
        if (data.success) {
          setAgents(data.agents);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-black">My agents</h1>
          <button className="text-xl">☰</button>
        </div>

        {/* Model strip */}
        {/* <ModelStrip /> */}

        {/* Filters */}
        <WorkspaceFilters href="/createAgent" />

        {/* Agents grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            {agents.map((agent) => (
              <AgentCard
                key={agent.ID}
                name={agent.Name}
                subtitle={agent.greeting_message || "No greeting"}
                workspace={agent.workspace_id ? `Workspace ${agent.workspace_id}` : "No workspace"}
                href={`/chat?id=${agent.ID}`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
