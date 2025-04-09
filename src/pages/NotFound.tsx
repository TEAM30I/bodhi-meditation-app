
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-app-gray-text mb-8">페이지를 찾을 수 없습니다</p>
        <Button 
          className="bg-app-orange hover:bg-app-orange/80 text-white"
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
