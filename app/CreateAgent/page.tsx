export default function AgentSettings() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* ===== TOP SECTION (General) ===== */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>

          <div className="space-y-6">
            <div className="flex flex-col">
            <label className="block text-sm font-medium text-black mb-2">
                Choose Model
            </label>

            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-black border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option>Anthropic Claude 4.5 Sonnet</option>
                <option>GPT 5.1</option>
            </select>
            </div>


            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">Creativity Level</label>
              <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">Greeting Messages</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Hi there! 👋 I'm Ada, your virtual guide!"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Add Greeting
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent Skills</label>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">Web Tool</button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">Extract Text</button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">Send Emails</button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">Deep Image Understanding</button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">Conversation Starters</button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">Response Options</label>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Auto Reply Hints</button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">+ Add Option</button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SCROLL DOWN SECTION (Instructions) ===== */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">Customer Support</button>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">Travel Planner</button>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">Role Play</button>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">SEO Expert</button>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">Business Consultant</button>
            </div>
          </div>

          <textarea 
            placeholder="Define the agent character. How should it behave? What to avoid?"
            rows={12}
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
