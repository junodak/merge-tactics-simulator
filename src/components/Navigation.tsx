import { useNavigate } from 'react-router-dom';
import type { Language } from '../types';

interface NavigationProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  isMobile: boolean;
  onHomeClick?: () => void; // 홈 클릭 시 추가 동작
}

export default function Navigation({ language, onLanguageChange, isMobile, onHomeClick }: NavigationProps) {
  const navigate = useNavigate();
  
  // 홈으로 이동
  const handleHomeClick = () => {
    onHomeClick?.(); // 추가 동작이 있다면 실행
    navigate('/'); // 홈으로 이동
  };

  // 반응형 패딩 값
  const buttonPadding = isMobile ? '8px' : '16px';

  return (
    <div className="flex justify-between items-center mb-6" style={{ padding: buttonPadding }}>
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleHomeClick}
        title="홈으로"
      >
        <img 
          src="/images/logo/logo.png" 
          alt="Merge Tactics" 
          className="h-16 md:h-20 object-contain"
        />
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          Deck Builder
        </h1>
      </div>
      
      {/* 언어 선택 */}
      <div className="flex items-center gap-2">
        <span className="text-white text-sm hidden md:block">언어:</span>
        <select 
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="bg-[#234d7d] text-white border border-gray-500 rounded px-3 py-2 text-sm hover:bg-[#2a5a8a] transition-colors cursor-pointer"
          title="언어 선택"
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
} 