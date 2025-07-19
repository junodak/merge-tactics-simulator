import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import type { Language } from '../types';

export default function PrivacyPage() {
  const [language, setLanguage] = useState<Language>(() => {
    // localStorage에서 저장된 언어 불러오기, 없으면 기본값 'ko'
    const savedLanguage = localStorage.getItem('merge-tactics-language');
    return (savedLanguage === 'ko' || savedLanguage === 'en') ? savedLanguage as Language : 'ko';
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
    title: '개인정보처리방침',
    lastUpdated: '최종 업데이트: 2025년 7월 20일',
    sections: [
      {
        title: '개인정보 수집',
        content: `저희는 개인정보를 수집하지 않습니다. 언어 설정만 브라우저에 저장됩니다.`
      },
      {
        title: '쿠키 사용',
        content: `• 언어 설정 저장 (한국어/English)
• Google 광고 표시를 위한 쿠키 사용 가능`
      },
      {
        title: '광고',
        content: `Google AdSense를 통해 광고가 표시될 수 있습니다. 광고는 익명화된 정보를 바탕으로 합니다.`
      },
      {
        title: '문의',
        content: `질문이 있으시면 papaci222@gmail.com으로 연락해 주세요.`
      }
    ]
  } : {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: July 20, 2025',
    sections: [
      {
        title: 'Information Collection',
        content: `We do not collect personal information. Only language settings are stored in your browser.`
      },
      {
        title: 'Cookie Usage',
        content: `• Language setting storage (Korean/English)
• Cookies may be used for Google advertising`
      },
      {
        title: 'Advertising',
        content: `Ads may be displayed through Google AdSense. Ads are based on anonymized information.`
      },
      {
        title: 'Contact',
        content: `If you have questions, please contact papaci222@gmail.com.`
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