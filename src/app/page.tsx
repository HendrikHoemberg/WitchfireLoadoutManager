/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
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
        <FeatureCard 
          title="Loadout Manager" 
          icon="⚔️"
          link="/manager"
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
      <div className="relative bg-[#30303071] rounded-lg p-8 h-64 w-64 hover:bg-[#3D3D3D] transition-colors border border-gray-600 hover:border-[#ddaf7aa6] flex flex-col items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/texture-transparent.PNG"
          alt=""
          fill
          sizes="256px"
          className="object-cover opacity-50 pointer-events-none z-0"
          priority={false}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-gray-100 hover:underline">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
