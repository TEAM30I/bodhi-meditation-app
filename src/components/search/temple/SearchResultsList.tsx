
import React from 'react';
import TempleItem from '@/components/search/TempleItem';
import { Temple } from '@/utils/repository';

interface SearchResultsListProps {
  loading: boolean;
  temples: Temple[];
  onTempleClick: (id: string) => void;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  loading,
  temples,
  onTempleClick,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {temples.length > 0 ? (
        temples.map((temple) => (
          <TempleItem
            key={temple.id}
            temple={temple}
            onClick={() => onTempleClick(temple.id)}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">다른 검색어를 입력해 보세요.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsList;
