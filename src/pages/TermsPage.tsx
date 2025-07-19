import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import type { Language } from '../types';

export default function TermsPage() {
  const [language, setLanguage] = useState<Language>(() => {
    // localStorage에서 저장된 언어 불러오기, 없으면 기본값 'ko'
    const savedLanguage = localStorage.getItem('merge-tactics-language');
    return (savedLanguage === 'ko' || savedLanguage === 'en') ? savedLanguage as Language : 'en';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 언어 변경 함수 (localStorage에 저장)
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('merge-tactics-language', newLanguage);
  };

  // 화면 크기 변화 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const content = language === 'ko' ? {
    title: '이용약관',
    lastUpdated: '최종 업데이트: 2025년 7월 20일',
    sections: [
      {
        title: '서비스 이용',
        content: `Merge Tactics Deck Builder는 무료로 제공되는 덱 빌딩 도구입니다. 누구나 자유롭게 이용할 수 있습니다.`
      },
      {
        title: '광고 표시',
        content: `서비스 운영을 위해 광고가 표시될 수 있습니다. 광고 차단기 사용은 자유입니다.`
      },
      {
        title: '면책사항',
        content: `서비스는 "있는 그대로" 제공되며, 서비스 중단이나 오류로 인한 손해에 대해 책임지지 않습니다.`
      },
      {
        title: '약관 변경',
        content: `필요시 약관을 변경할 수 있으며, 중요한 변경사항은 사이트에 공지합니다.`
      }
    ]
  } : {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: July 20, 2025',
    sections: [
      {
        title: 'Service Usage',
        content: `Merge Tactics Deck Builder is a free deck building tool. Anyone can use it freely.`
      },
      {
        title: 'Advertising',
        content: `Ads may be displayed to support the service. You are free to use ad blockers.`
      },
      {
        title: 'Disclaimer',
        content: `The service is provided "as is" and we are not responsible for damages due to service interruptions or errors.`
      },
      {
        title: 'Terms Changes',
        content: `We may change these terms when necessary and will announce important changes on the site.`
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: '#1b1c3c' }}>
      <div className="w-full max-w-4xl" style={{ padding: isMobile ? '24px' : '48px' }}>
        {/* 네비게이션 */}
        <Navigation 
          language={language}
          onLanguageChange={handleLanguageChange}
          isMobile={isMobile}
        />

        {/* 메인 컨텐츠 */}
        <div className="shadow-lg" style={{ 
          backgroundColor: '#234d7d', 
          padding: isMobile ? '24px' : '48px',
          marginBottom: '48px'
        }}>
          <h1 className="text-white text-3xl font-bold" style={{ marginBottom: '16px' }}>{content.title}</h1>
          <p className="text-gray-300" style={{ marginBottom: '32px' }}>{content.lastUpdated}</p>
          
          {content.sections.map((section, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <h2 className="text-white text-xl font-bold" style={{ marginBottom: '16px' }}>{section.title}</h2>
              <div className="text-gray-200 text-base leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <Footer language={language} isMobile={isMobile} />
      </div>
    </div>
  );
} 