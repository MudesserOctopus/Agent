type Props = {
    name: string;
    subtitle: string;
    workspace: string;
    tools?: number;
  };
  
  export default function AgentCard({
    name,
    subtitle,
    workspace,
    tools,
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
              <button className="px-3 py-1 border rounded-md text-sm">
                Chat
              </button>
              <button className="px-2">⋮</button>
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
  