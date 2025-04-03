
import { useNavigate, useEffect } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the welcome page
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-bodhi-background">
      <div className="text-center">
        <p className="text-xl text-bodhi-darkGray">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
