import Link from "next/link";
type Props = {
    name: string;
    subtitle: string;
    workspace: string;
    tools?: number;
    href:string;
    agentId: number;
  };
  
  export default function AgentCard({
    name,
    subtitle,
    workspace,
    tools,
    href,
    agentId,
  }: Props) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              🤖
            </div>
            <div className="flex gap-2">
              <Link href={`/createAgent?edit=${agentId}`} className="inline-block">
                <button className="px-3 py-1 border rounded-md text-sm cursor-pointer">
                  Edit
                </button>
              </Link>
              <Link href={href} className="inline-block">
                <button className="px-3 py-1 border rounded-md text-sm cursor-pointer">
                  Chat
                </button>
              </Link>
            </div>
          </div>
          
  
          {/* Content */}
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-500">({workspace})</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {subtitle}
          </p>
        </div>
  
        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <button className="border px-2 py-1 rounded-md">📈</button>
          {tools && (
            <span className="text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {tools} Tools
            </span>
          )}
        </div>
      </div>
    );
  }
  