import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-500 mb-6">Witchfire Loadout Manager & Randomizer</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Create, manage, and randomize balanced loadouts for Witchfire with element preferences and detailed item information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
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

      <div className="mt-16 bg-gray-900 rounded-lg p-6 max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-red-400 mb-4">About Witchfire</h2>
        <p className="text-gray-300 mb-4">
          Witchfire is a dark fantasy first-person shooter developed by The Astronauts. Set in an alternate history where witches are real and deadly, the game combines fast-paced gunplay with magical abilities.
        </p>
        <p className="text-gray-300">
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
      <div className="bg-gray-900 rounded-lg p-6 h-full hover:bg-gray-800 transition-colors border border-gray-700 hover:border-red-500">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-red-400 mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </Link>
  );
}
