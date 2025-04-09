
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mt-10 mb-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-white"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      {label && <h1 className="text-white text-xl font-medium mx-auto">{label}</h1>}
    </div>
  );
};

export default BackButton;
