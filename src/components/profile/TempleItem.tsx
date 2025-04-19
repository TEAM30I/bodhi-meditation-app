
interface TempleItemProps {
  name: string;
  location: string;
  imageUrl: string;
  showButton?: boolean;
}

export default function TempleItem({ name, location, imageUrl, showButton = false }: TempleItemProps) {
  return (
    <div className="flex items-center p-4 border-b border-gray-100">
      <img src={imageUrl} alt={name} className="w-[60px] h-[60px] rounded-lg object-cover" />
      <div className="flex-1 ml-3">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
      {showButton && (
        <button className="px-4 py-2 bg-[#ff7730] text-white rounded-lg text-sm">
          둘러보기
        </button>
      )}
    </div>
  );
}
