
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col items-center justify-center p-6">
      <h1 className="text-white text-3xl font-bold mb-6">환영합니다!</h1>
      <p className="text-app-gray-text text-center mb-10">
        회원가입이 성공적으로 완료되었습니다.
      </p>
      
      <Button 
        className="bg-app-orange hover:bg-app-orange/80 text-white"
        onClick={() => navigate('/')}
      >
        첫 화면으로 돌아가기
      </Button>
    </div>
  );
};

export default Index;
