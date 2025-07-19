import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TroopCard from '../components/TroopCard';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import type { Troop, Trait, Language } from '../types';

export default function TroopPage() {
  const { troopId } = useParams<{ troopId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>(() => {
    // localStorage에서 저장된 언어 불러오기, 없으면 기본값 'ko'
    const savedLanguage = localStorage.getItem('merge-tactics-language');
    return (savedLanguage === 'ko' || savedLanguage === 'en') ? savedLanguage as Language : 'ko';
  });
  const [troops, setTroops] = useState<Troop[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 언어 변경 함수 (localStorage에 저장)
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('merge-tactics-language', newLanguage);
  };

  // 이미지 파일명으로 유닛 찾기 (예: archers -> archers.webp)
  const currentTroop = troops.find(troop => {
    const imageName = troop.image.split('/').pop()?.replace('.webp', '');
    return imageName === troopId;
  });

  // JSON 데이터를 불러오는 함수
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [troopsResponse, traitsResponse] = await Promise.all([
          fetch(`/data/troops-${language}.json`),
          fetch(`/data/traits-${language}.json`)
        ]);

        const troopsData: Troop[] = await troopsResponse.json();
        const traitsData: Trait[] = await traitsResponse.json();

        setTroops(troopsData);
        setTraits(traitsData);
        setLoading(false);
      } catch (error) {
        console.error(language === 'ko' ? '데이터 로딩 실패:' : 'Data loading failed:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // 화면 크기 변화 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 특성 이름으로 특성 객체 찾기
  const findTrait = (traitName: string): Trait | undefined => {
    return traits.find(trait => trait.name === traitName);
  };

  // 유닛 이미지에서 troopId 추출 함수
  const getTroopId = (troop: Troop): string => {
    return troop.image.split('/').pop()?.replace('.webp', '') || '';
  };

  // 다른 유닛 상세 페이지로 이동
  const navigateToTroop = (troop: Troop) => {
    const newTroopId = getTroopId(troop);
    navigate(`/troops/${newTroopId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1b1c3c' }}>
        <div className="text-2xl text-white">{language === 'ko' ? '데이터 로딩중...' : 'Loading data...'}</div>
      </div>
    );
  }

  if (!currentTroop) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1b1c3c' }}>
        <div className="text-center text-white">
          <div className="text-2xl mb-4">{language === 'ko' ? '유닛을 찾을 수 없습니다' : 'Unit not found'}</div>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          >
            {language === 'ko' ? '뒤로가기' : 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  const originTrait = findTrait(currentTroop.origin_trait);
  const roleTrait = findTrait(currentTroop.role_trait);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center" style={{ backgroundColor: '#1b1c3c' }}>
      <div className="w-full max-w-4xl">
        {/* 네비게이션 */}
        <Navigation 
          language={language}
          onLanguageChange={handleLanguageChange}
          isMobile={isMobile}
        />

        {/* 유닛 카드와 기본 정보 */}
        <div className="shadow-lg" style={{ 
          backgroundColor: '#234d7d', 
          padding: '24px', 
          marginBottom: isMobile ? '24px' : '48px' 
        }}>
          <div className="flex flex-col md:flex-row items-center" style={{ gap: isMobile ? '24px' : '40px' }}>
            {/* 유닛 카드 */}
            <div className="flex-shrink-0">
              <div style={{ width: '200px' }}>
                <TroopCard 
                  troop={currentTroop}
                  originTrait={originTrait}
                  roleTrait={roleTrait}
                  isMobile={false}
                />
              </div>
            </div>

            {/* 유닛 정보 */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-white text-3xl font-bold" style={{ marginBottom: isMobile ? '16px' : '32px' }}>{currentTroop.name}</h1>
              <p className="text-gray-200 text-lg" style={{ marginBottom: isMobile ? '20px' : '40px' }}>{currentTroop.description}</p>
              
              {/* 엘릭서 + 특성들 */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {/* 엘릭서 */}
                <div className="flex items-center">
                  <img 
                    src={`/images/elixir/elixir_${currentTroop.elixir}.png`}
                    alt={`${language === 'ko' ? '엘릭서' : 'Elixir'} ${currentTroop.elixir}`}
                    className="w-8 h-8"
                    title={`${language === 'ko' ? '엘릭서' : 'Elixir'}: ${currentTroop.elixir}`}
                  />
                </div>

                {/* 출신 특성 */}
                {originTrait && (
                  <div className="flex items-center gap-2">
                    <img 
                      src={originTrait.image} 
                      alt={originTrait.name}
                      className="w-8 h-8 rounded-full bg-black/20"
                    />
                    <span className="text-white font-semibold">{originTrait.name}</span>
                  </div>
                )}

                {/* 역할 특성 */}
                {roleTrait && (
                  <div className="flex items-center gap-2">
                    <img 
                      src={roleTrait.image} 
                      alt={roleTrait.name}
                      className="w-8 h-8 rounded-full bg-black/20"
                    />
                    <span className="text-white font-semibold">{roleTrait.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 특성 상세 정보 */}
        <div className="grid md:grid-cols-2" style={{ gap: isMobile ? '20px' : '40px' }}>
          {/* 출신 특성 정보 */}
          {originTrait && (
            <div className="shadow-lg" style={{ backgroundColor: '#2a3a5c', padding: '24px' }}>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={originTrait.image} 
                  alt={originTrait.name}
                  className="w-12 h-12 rounded-full bg-black/20"
                />
                <div>
                  <h3 className="text-white font-bold text-xl">{originTrait.name}</h3>
                </div>
              </div>
              
              <p className="text-gray-200 mb-4" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}>
                {originTrait.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {originTrait.effects?.map((effect, index) => (
                  <div 
                    key={index}
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}
                  >
                    <div className="flex">
                      <span className="font-semibold text-white flex-shrink-0" style={{ marginRight: '16px' }}>
                        [{effect.count}]
                      </span>
                      <span className="font-semibold text-white">
                        {effect.effect}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 해당 특성을 가진 유닛들 */}
              <div className="grid grid-cols-3">
                {troops
                  .filter(troop => 
                    (troop.origin_trait === originTrait.name || troop.role_trait === originTrait.name) &&
                    troop.name !== currentTroop?.name
                  )
                  .slice(0, 3) // 최대 3개
                  .map((troop) => {
                    const troopOriginTrait = findTrait(troop.origin_trait);
                    const troopRoleTrait = findTrait(troop.role_trait);
                    
                    return (
                      <div key={troop.name} className="relative flex flex-col items-center">
                        <div 
                          className="cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => navigateToTroop(troop)}
                          title={`${troop.name} ${language === 'ko' ? '상세 보기' : 'details'}`}
                        >
                          <TroopCard 
                            troop={troop}
                            originTrait={troopOriginTrait}
                            roleTrait={troopRoleTrait}
                            isMobile={isMobile}
                          />
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )}

          {/* 역할 특성 정보 */}
          {roleTrait && (
            <div className="shadow-lg" style={{ backgroundColor: '#2a3a5c', padding: '24px' }}>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={roleTrait.image} 
                  alt={roleTrait.name}
                  className="w-12 h-12 rounded-full bg-black/20"
                />
                <div>
                  <h3 className="text-white font-bold text-xl">{roleTrait.name}</h3>
                </div>
              </div>
              
              <p className="text-gray-200 mb-4" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}>
                {roleTrait.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {roleTrait.effects?.map((effect, index) => (
                  <div 
                    key={index}
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}
                  >
                    <div className="flex">
                      <span className="font-semibold text-white flex-shrink-0" style={{ marginRight: '16px' }}>
                        [{effect.count}]
                      </span>
                      <span className="font-semibold text-white">
                        {effect.effect}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 해당 특성을 가진 유닛들 */}
              <div className="grid grid-cols-3">
                {troops
                  .filter(troop => 
                    (troop.origin_trait === roleTrait.name || troop.role_trait === roleTrait.name) &&
                    troop.name !== currentTroop?.name
                  )
                  .slice(0, 3) // 최대 3개
                  .map((troop) => {
                    const troopOriginTrait = findTrait(troop.origin_trait);
                    const troopRoleTrait = findTrait(troop.role_trait);
                    
                    return (
                      <div key={troop.name} className="relative flex flex-col items-center">
                        <div 
                          className="cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => navigateToTroop(troop)}
                          title={`${troop.name} ${language === 'ko' ? '상세 보기' : 'details'}`}
                        >
                          <TroopCard 
                            troop={troop}
                            originTrait={troopOriginTrait}
                            roleTrait={troopRoleTrait}
                            isMobile={isMobile}
                          />
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <Footer 
          language={language}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
