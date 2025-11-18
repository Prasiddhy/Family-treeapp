export default function PlaceholderImage({ name, size = 200, className = '' }: { name?: string; size?: number; className?: string }) {
  const initials = (name || 'N A')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

  return (
    <div
      className={`flex items-center justify-center bg-gray-200 text-gray-700 font-semibold ${className}`}
      style={{ width: size, height: size }}
    >
      {initials || 'NA'}
    </div>
  );
}









