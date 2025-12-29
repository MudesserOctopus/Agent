export default function WorkspaceFilters() {
    return (
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {["All", "Agents 5", "Workforces 1"].map((tab, i) => (
            <button
              key={tab}
              className={`px-3 py-1 rounded-md border ${
                i === 0
                  ? "bg-white shadow text-black"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
  
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded-md"
        />
  
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span>All</span>
          <span className="bg-purple-600 text-white text-sm px-2 py-1 rounded-full">
            6
          </span>
        </div>
  
        <span className="ml-auto flex items-center gap-2">
          <button className="border p-2 rounded-md">⬛⬛</button>
          <button className="border p-2 rounded-md">☰</button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
            + New
          </button>
        </span>
      </div>
    );
  }
  