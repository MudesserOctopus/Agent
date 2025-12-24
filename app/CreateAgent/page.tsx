"use client";
import { useState } from "react";


export default function AgentSettings() {
  const [name, setName] = useState("");
  const [model, setModel] = useState("Anthropic Claude 4.5 Sonnet");
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [greetingMessage, setGreetingMessage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSaveAgent = async () => {
    // Validate required fields
    if (!name.trim()) {
      setMessage({ type: "error", text: "Please enter an agent name" });
      return;
    }
    if (!greetingMessage.trim()) {
      setMessage({ type: "error", text: "Please enter a greeting message" });
      return;
    }
    if (!instructions.trim()) {
      setMessage({ type: "error", text: "Please enter instructions" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const agentData = {
        name: name ,
        model: model, 
        creativity_level: creativityLevel,
        greeting_message: greetingMessage,
        instructions: instructions,

      };
      
      

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      });
      
      if (response.ok) {
        setMessage({ type: "success", text: "Agent saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save agent" });
      }

      
    } catch (error) {
      console.error("Error saving agent:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save agent";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* ===== TOP SECTION (General) ===== */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            General Settings
          </h2>

          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-black mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter agent name"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-black mb-2">
                Choose Model
              </label>

              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-black border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>Anthropic Claude 4.5 Sonnet</option>
                <option>GPT 5.1</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creativity Level: {creativityLevel}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Greeting Messages *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  placeholder="Hi there! 👋 I'm Ada, your virtual guide!"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Add Greeting
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Skills
              </label>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                  Web Tool
                </button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                  Extract Text
                </button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                  Send Emails
                </button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                  Deep Image Understanding
                </button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                  Conversation Starters
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Options
              </label>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                  Auto Reply Hints
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  + Add Option
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SCROLL DOWN SECTION (Instructions) ===== */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Instructions
          </h2>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">
                Customer Support
              </button>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">
                Travel Planner
              </button>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">
                Role Play
              </button>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">
                SEO Expert
              </button>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200">
                Business Consultant
              </button>
            </div>
          </div>

          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Define the agent character. How should it behave? What to avoid?"
            rows={12}
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => handleSaveAgent()  }
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Agent"}
          </button>
          {message.text && (
            <div
              className={`px-4 py-2 rounded-md ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
