import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
        <FeatureCard 
          title="Loadout Manager" 
          icon="⚔️"
          link="/manager"
        />
        <FeatureCard 
          title="Loadout Randomizer" 
          icon="🎲"
          link="/randomizer"
        />
        <FeatureCard 
          title="Item Wiki" 
          icon="📚"
          link="/wiki"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  icon: string;
  link: string;
}

function FeatureCard({ title, icon, link }: FeatureCardProps) {
  return (
    <Link href={link} className="block">
      <div className="relative bg-[#30303071] rounded-lg p-8 h-64 w-64 hover:bg-[#3D3D3D] transition-colors border border-gray-600 hover:border-red-800 flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src="/images/texture-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none z-0"
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-gray-100 hover:underline">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
