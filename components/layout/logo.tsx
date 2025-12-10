import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap: Record<'sm' | 'md' | 'lg', { icon: number; text: string }> = {
  sm: { icon: 24, text: 'text-base' },
  md: { icon: 32, text: 'text-lg' },
  lg: { icon: 40, text: 'text-xl' },
};

export function Logo({ showText = false, size = 'md', className = '' }: LogoProps) {
  const { icon, text } = sizeMap[size] ?? sizeMap.md;

  return (
    <Link href="/" className={`flex items-center gap-2 group flex-shrink-0 ${className}`}>
      <div className="relative flex items-center justify-center transition-transform group-hover:scale-105">
        <img
          src="/logo.png"
          alt="OSRS Tracker"
          width={icon}
          height={icon}
          className="block"
          style={{ width: `${icon}px`, height: `${icon}px` }}
        />
      </div>
      {showText && (
        <span className={`${text} font-bold text-stone-100 hidden lg:inline-block`}>
          OSRS<span className="text-amber-500">Tracker</span>
        </span>
      )}
    </Link>
  );
}
