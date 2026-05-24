"use client";


interface SimulationPlayerProps {
  url: string;
  title: string;
}

export default function SimulationPlayer({ url, title }: SimulationPlayerProps) {
  return (
    <div className="space-y-4">
      {/* iframe */}
      <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 relative">
        <iframe
          className="w-full h-full"
          src={url}
          title={`${title} Simulation`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
