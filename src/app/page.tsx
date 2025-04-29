import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-70">
        <FeatureCard 
          title="Loadout Manager" 
          description="Manually create and customize loadouts with a visual interface."
          icon="⚔️"
          link="/manager"
        />
        <FeatureCard 
          title="Loadout Randomizer" 
          description="Generate balanced loadouts with optional element preferences and item exclusions."
          icon="🎲"
          link="/randomizer"
        />
        <FeatureCard 
          title="Item Wiki" 
          description="Browse all game items with detailed information, filtering, and sorting options."
          icon="📚"
          link="/wiki"
        />
      </div>

      <div className="mt-16 bg-[#303030] rounded-lg p-6 max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-[#c00101] mb-4">About Witchfire</h2>
        <p className="text-gray-100 mb-4">
          Witchfire is a dark fantasy first-person shooter developed by The Astronauts. Set in an alternate history where witches are real and deadly, the game combines fast-paced gunplay with magical abilities.
        </p>
        <p className="text-gray-100">
          This tool helps you experiment with different loadout combinations, discover synergies between items, and optimize your gameplay experience.
        </p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

function FeatureCard({ title, description, icon, link }: FeatureCardProps) {
  return (
    <Link href={link} className="block">
      <div className="bg-[#303030] rounded-lg p-0 h-full hover:bg-[#3D3D3D] transition-colors border border-gray-600 hover:border-red-600">
        <div className="flex items-center mb-1 bg-[#555555] w-full rounded-t-lg p-3 space-x-3">
          <div className="text-4xl">{icon}</div>
          <h3 className="text-xl font-bold text-red-600 hover:underline">{title}</h3>
        </div>
        <div className="p-2">
          <p className="text-gray-100 text">{description}</p>
        </div>
      </div>
    </Link>
  );
}
