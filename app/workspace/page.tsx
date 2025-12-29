import ModelStrip from "@/app/components/ModeStrip";
import WorkspaceFilters from "@/app/components/WorkspaceFilters";
import AgentCard from "@/app/components/AgentCard";
import Sidebar from "@/app/components/sidebar";

const agents = [
  {
    name: "Octopus",
    subtitle: "My Virtual Assistant",
    workspace: "No workspace",
  },
 
];

export default function WorkspacePage() {
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
          <ModelStrip />
  
          {/* Filters */}
          <WorkspaceFilters />
  
          {/* Agents grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            {agents.map((agent) => (
              <AgentCard key={agent.name} {...agent} />
            ))}
          </div>
        </main>
      </div>
    );
  }
