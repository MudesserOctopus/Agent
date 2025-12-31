"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function AgentSettings() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [model, setModel] = useState("Anthropic Claude 4.5 Sonnet");
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [greetingMessage, setGreetingMessage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
 

 
  

  // Left navigation: General / Knowledge
  const [activeSection, setActiveSection] =
    useState<"general" | "knowledge">("general");

  // Quick knowledge state
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [quickItems, setQuickItems] = useState<
    { title: string; content: string }[]
  >([]);

  // Documents upload state
  const [documents, setDocuments] = useState<File[]>([]);

  // Websites state
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [error, setError] = useState("");
  const [websites, setWebsites] = useState<string[]>([]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  const checkWebsiteUrl = () => {
    if (!isValidUrl(websiteUrl)) {
      setError("Please enter a valid website URL (including https://)");
      return false;
    }
    setError("");
    return true;
  };

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
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setMessage({ type: "error", text: "User not logged in" });
        return;
      }

      const agentData = {
        name: name ,
        model: model, 
        creativity_level: creativityLevel,
        greeting_message: greetingMessage,
        instructions: instructions,
        websites: websites,
        quickItems: quickItems,
        workspace_id: parseInt(userId),

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
        router.push("/workspace"); // 🔁 change "/" to your desired route
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

  const handleAddQuickKnowledge = () => {
    if (!quickTitle.trim() || !quickContent.trim()) return;
    setQuickItems((prev: { title: string; content: string }[]) => [
      ...prev,
      { title: quickTitle, content: quickContent },
    ]);
    setQuickTitle("");
    setQuickContent("");
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setDocuments(filesArray);
  };

  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) return;
    if (!checkWebsiteUrl()) return;
    setWebsites((prev: string[]) => [...prev, websiteUrl.trim()]);
    setWebsiteUrl("");
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create Agent</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAgent}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Agent"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-6">
        {/* LEFT NAVIGATION */}
        <aside className="w-56 bg-white shadow rounded-lg p-4 h-fit">
          <nav className="space-y-4">
            <div>
              
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === "general"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection("general")}
              >
                General
              </button>
              <button
                className={`mt-1 w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === "knowledge"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection("knowledge")}
              >
                Knowledge
              </button>
            </div>
          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 space-y-6">
          {activeSection === "general" && (
            <>
              {/* TOP SECTION (General) */}
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
                      onChange={(e) =>
                        setCreativityLevel(parseInt(e.target.value))
                      }
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

              {/* SCROLL DOWN SECTION (Instructions) */}
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
              
            </>
          )}

          {activeSection === "knowledge" && (
            <>
              {/* QUICK KNOWLEDGE */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Quick Knowledge
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Add short knowledge snippets with a title and content that your
                  agent can use during conversations.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      placeholder="e.g. Shipping policy summary"
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      rows={4}
                      value={quickContent}
                      onChange={(e) => setQuickContent(e.target.value)}
                      placeholder="Write the content your agent should know..."
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuickKnowledge}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 self-start"
                  >
                    Add Quick Knowledge
                  </button>
                </div>

                {quickItems.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Added Quick Knowledge
                    </h3>
                    <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {quickItems.map(
                        (item: { title: string; content: string }, index: number) => (
                        <div key={index} className="p-3">
                          <p className="text-sm font-medium text-gray-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DOCUMENTS UPLOAD */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Documents
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Upload spreadsheet documents your agent can use as knowledge.
                  Accepted formats:{" "}
                  <span className="font-medium">xls, xlsx, csv</span>.
                </p>

                <label
                  htmlFor="documents-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-10 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Drag and drop your files here
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    or click to browse
                  </span>
                  <input
                    id="documents-upload"
                    type="file"
                    multiple
                    accept=".xls,.xlsx,.csv"
                    className="hidden"
                    onChange={handleDocumentsChange}
                  />
                </label>

                {documents.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Uploaded documents
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {documents.map((file: File, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          <span>{file.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* WEBSITES */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Websites
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Add website URLs that your agent can use as a knowledge
                  source.
                </p>

                <div className="flex gap-2 mb-1">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="https://www.example.com"
                    className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddWebsite}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add link
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                )}

                {websites.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Added websites
                    </h3>
                    <ul className="space-y-1 text-sm text-indigo-700">
                      {websites.map((url: string, index: number) => (
                        <li key={index}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline break-all"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
      </div>
     
    </div>
  );
}
