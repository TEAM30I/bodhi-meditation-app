import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './config/aws-config.ts'; // import만 하고 변수는 사용하지 않습니다.


createRoot(document.getElementById("root")!).render(<App />);
