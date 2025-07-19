import { useNavigate } from 'react-router-dom';
import type { Language } from '../types';

interface FooterProps {
  language: Language;
  isMobile: boolean;
}

export default function Footer({ language, isMobile }: FooterProps) {
  const navigate = useNavigate();

  return (
    <footer className="text-center text-gray-400" style={{ 
      marginTop: isMobile ? '40px' : '80px',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div className="mb-4">
        <p className="text-sm md:text-base">
          © 2024 Merge Tactics Deck Builder. All rights reserved.
        </p>
      </div>
      <div className="flex justify-center gap-4 md:gap-6 text-xs md:text-sm">
        <button 
          onClick={() => navigate('/privacy')}
          className="hover:text-white transition-colors text-gray-400 underline-none border-none bg-transparent cursor-pointer"
        >
          {language === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
        </button>
        <span>|</span>
        <button 
          onClick={() => navigate('/terms')}
          className="hover:text-white transition-colors text-gray-400 underline-none border-none bg-transparent cursor-pointer"
        >
          {language === 'ko' ? '이용약관' : 'Terms of Service'}
        </button>
        <span>|</span>
        <button 
          onClick={() => navigate('/contact')}
          className="hover:text-white transition-colors text-gray-400 underline-none border-none bg-transparent cursor-pointer"
        >
          {language === 'ko' ? '문의하기' : 'Contact'}
        </button>
      </div>
    </footer>
  );
} 