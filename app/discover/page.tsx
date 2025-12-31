import Sidebar from "@/app/components/sidebar";
import DiscoverCard from "@/app/components/discovercard";

export default function DiscoverPage() {
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black">Discover</h1>
          <p className="text-gray-500">Hire AI workforce for your business</p>
        </div>

        {/* Featured cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <DiscoverCard
            tags={["Business", "Marketing", "Productivity"]}
            title="AI Chatbot Creator"
            description="Build a smart, friendly AI Agent that greets visitors, answers questions, and collects leads — all in just 3 simple steps."
            
          />

          <DiscoverCard
            tags={["Marketing", "Business", "Utility"]}
            title="SDR Lead Hunt Team"
            description="Find your best-fit customers faster with AI-driven prospecting."
            
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            ["Productivity", "19 templates"],
            ["Business", "16 templates"],
            ["Marketing", "13 templates"],
            ["Education", "6 templates"],
            ["Entertainment", "4 templates"],
            ["Finance", "4 templates"],
          ].map(([title, subtitle]) => (
            <div
              key={title}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow transition"
            >
              <h3 className="font-medium text-black">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
