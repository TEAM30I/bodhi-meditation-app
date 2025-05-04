
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="px-5 py-3">
      <div className="flex items-center px-4 py-3 bg-gray-100 rounded-full">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="도시, 지역, 사찰명"
          className="bg-transparent w-full outline-none text-sm"
        />
      </div>
    </div>
  );
}
