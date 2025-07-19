import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import type { Language } from '../types';

export default function ContactPage() {
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
    title: '문의하기',
    description: '질문이나 문제가 있으시면 이메일로 연락해 주세요.',
    sections: [
      {
        title: '📧 연락처',
        content: `papaci222@gmail.com

답변 시간: 1-3일`
      },
      {
        title: '❓ 자주 묻는 질문',
        content: `Q: 덱을 어떻게 공유하나요?
A: 6개 이상의 유닛을 선택하면 "덱 공유" 버튼이 나타납니다.

Q: 특성 시너지는 어떻게 작동하나요?
A: 같은 특성의 유닛 수에 따라 자동으로 계산됩니다.

Q: 모바일에서도 사용할 수 있나요?
A: 네, 모바일에 최적화되어 있습니다.`
      }
    ]
  } : {
    title: 'Contact Us',
    description: 'If you have questions or problems, please contact us via email.',
    sections: [
      {
        title: '📧 Contact',
        content: `papaci222@gmail.com

Response time: 1-3 days`
      },
      {
        title: '❓ FAQ',
        content: `Q: How do I share a deck?
A: Select 6+ units and the "Share Deck" button will appear.

Q: How do trait synergies work?
A: They are automatically calculated based on the number of units with the same trait.

Q: Can I use it on mobile?
A: Yes, it's optimized for mobile.`
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
          <p className="text-gray-300 text-lg" style={{ marginBottom: '32px' }}>{content.description}</p>
          
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