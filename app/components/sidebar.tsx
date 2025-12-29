import Link from "next/link";

const menuItems = [
    { label: "Explore", href: "/explore" },
    { label: "Workspaces", href: "/workspace" },
    { label: "Chat History", href: "/chat-history" },
    { label: "Statistics", href: "/statistics" },
    { label: "Scheduler", href: "/scheduler" },
    { label: "Notifications", href: "/notifications" },
    { label: "Help", href: "/help" },
  ];
  export default function Sidebar() {
    return (
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="font-semibold text-lg text-black">My agents</h2>
        </div>
  
        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block px-3 py-2 rounded-md cursor-pointer
                ${
                  item.label === "Explore"
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
  
        <button className="mt-6 border border-indigo-500 text-indigo-600 rounded-full py-2 hover:bg-indigo-50">
          Upgrade
        </button>
      </aside>
    );
  }
  