export default function ModelStrip() {
    const models = [
      "Image Generator",
      "GPT-5 mini",
      "GPT-5.1",
      "Gemini 3 Pro",
      "Grok 4",
      "Grok 4.1 Fast",
    ];
  
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
        {models.map((model) => (
          <div
            key={model}
            className="min-w-[160px] h-20 bg-white rounded-xl shadow-sm flex items-center justify-center font-medium"
          >
            {model}
          </div>
        ))}
      </div>
    );
  }
  