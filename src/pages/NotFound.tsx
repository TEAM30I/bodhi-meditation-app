
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-bodhi-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 font-pretendard">404</h1>
        <p className="text-xl text-bodhi-darkGray mb-6 font-pretendard">
          페이지를 찾을 수 없습니다
        </p>
        <Button 
          className="bg-bodhi-orange hover:bg-bodhi-orange/90"
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
