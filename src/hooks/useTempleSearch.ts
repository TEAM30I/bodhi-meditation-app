
import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { searchTemples, type Temple } from '@/utils/repository';
import { typedData } from '@/utils/typeUtils';

export const useTempleSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const query = searchParams.get('query') || '';
  const region = searchParams.get('region') || '';
  const nearby = searchParams.get('nearby') === 'true';
  
  const [searchValue, setSearchValue] = useState(query || region);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [activeFilter, setActiveFilter] = useState<'popular' | 'recent'>('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const searchTerm = query || region;
    
    if (searchTerm) {
      const results = searchTemples(searchTerm);
      setTemples(typedData<Temple[]>(results));
    } else if (nearby) {
      const results = searchTemples("");
      setTemples(typedData<Temple[]>(results));
    } else {
      setTemples([]);
    }
    
    setLoading(false);
  }, [location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  const handleSearch = () => navigate(`/search/temple/results?query=${searchValue}`);
  
  const handleTempleClick = (id: string) => {
    navigate(`/search/temple/detail/${id}`);
  };

  return {
    searchValue,
    setSearchValue,
    temples,
    activeFilter,
    setActiveFilter,
    loading,
    handleSearchSubmit,
    handleSearch,
    handleTempleClick
  };
};
