type Props = {
    title: string;
    description: string;
    
    tags: string[];
  };
  
  export default function DiscoverCard({
    title,
    description,
    
    tags,
  }: Props) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow transition">
        <div className="flex gap-2 mb-3 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
  
        <h2 className="text-xl font-semibold mb-2 text-black">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
  
        
      </div>
    );
  }
  