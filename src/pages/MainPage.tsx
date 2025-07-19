import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import TroopCard from '../components/TroopCard';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import type { Troop, Trait, Language } from '../types';

export default function MainPage() {
  const navigate = useNavigate();
  const { deckCode } = useParams<{ deckCode?: string }>();
  const location = useLocation();
  const [language, setLanguage] = useState<Language>(() => {
    // localStorage에서 저장된 언어 불러오기, 없으면 기본값 'ko'
    const savedLanguage = localStorage.getItem('merge-tactics-language');
    return (savedLanguage === 'ko' || savedLanguage === 'en') ? savedLanguage as Language : 'ko';
  });
  const [troops, setTroops] = useState<Troop[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Troop[]>([]); // 선택된 덱
  const [clickedTroop, setClickedTroop] = useState<string | null>(null); // 클릭된 유닛
  const [clickedTrait, setClickedTrait] = useState<string | null>(null); // 클릭된 특성
  const [clickedTraitTroop, setClickedTraitTroop] = useState<string | null>(null); // 특성 상세에서 클릭된 유닛
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // 모바일 여부
  const [isLoadingFromURL, setIsLoadingFromURL] = useState(false); // URL에서 덱을 로딩 중인지

  // 언어 변경 함수 (localStorage에 저장)
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('merge-tactics-language', newLanguage);
  };

  // 유닛을 알파벳으로 변환 (troops 배열 인덱스 기반)
  const troopToCode = (troop: Troop): string => {
    const index = troops.findIndex(t => t.name === troop.name);
    if (index === -1) return '';
    return String.fromCharCode(97 + index); // a, b, c, d, ...
  };

  // 알파벳을 유닛으로 변환
  const codeToTroop = (code: string): Troop | null => {
    const index = code.charCodeAt(0) - 97; // a=0, b=1, c=2, ...
    return troops[index] || null;
  };

  // 덱을 URL 코드로 변환
  const deckToCode = (deck: Troop[]): string => {
    return deck.map(troopToCode).join('');
  };

  // URL 코드를 덱으로 변환
  const codeToDeck = (code: string): Troop[] => {
    return code.split('').map(codeToTroop).filter(Boolean) as Troop[];
  };

  // URL 업데이트 함수
  const updateURL = (deck: Troop[]) => {
    const code = deckToCode(deck);
    if (code.length > 0) {
      navigate(`/deck/${code}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // JSON 데이터를 불러오는 함수
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 선택된 언어에 따라 데이터 불러오기
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

  // URL에서 덱 코드 읽어서 덱 초기화
  useEffect(() => {
    if (troops.length > 0 && deckCode && !isLoadingFromURL) {
      setIsLoadingFromURL(true);
      const decodedDeck = codeToDeck(deckCode);
      setSelectedDeck(decodedDeck);
      setIsLoadingFromURL(false);
    }
  }, [troops, deckCode]);

  // 덱 변경시 URL 업데이트 (URL에서 로딩 중이거나 홈에 있을 때는 제외)
  useEffect(() => {
    if (troops.length > 0 && !isLoadingFromURL) {
      const currentCode = deckToCode(selectedDeck);
      const expectedPath = currentCode.length > 0 ? `/deck/${currentCode}` : '/';
      
      if (location.pathname !== expectedPath) {
        updateURL(selectedDeck);
      }
    }
  }, [selectedDeck, troops, location.pathname]);

  // 화면 크기 변화 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 특성 이름으로 특성 객체 찾기
  const findTraits = (traitsName: string): Trait | undefined => {
    return traits.find(trait => trait.name === traitsName);
  };

  // 유닛 클릭 함수 (정보/버튼 표시용)
  const handleTroopClick = (troop: Troop) => {
    setClickedTroop(prevClicked => prevClicked === troop.name ? null : troop.name);
    setClickedTrait(null); // 특성 클릭 상태 해제
    setClickedTraitTroop(null); // 특성 상세 유닛 클릭 상태 해제
  };

  // 특성 클릭 함수 (정보 표시용)
  const handleTraitClick = (traitName: string) => {
    setClickedTrait(prevClicked => prevClicked === traitName ? null : traitName);
    setClickedTroop(null); // 유닛 클릭 상태 해제
    setClickedTraitTroop(null); // 특성 상세 유닛 클릭 상태 해제
  };

  // 특성 상세에서 유닛 클릭 함수
  const handleTraitTroopClick = (troop: Troop) => {
    setClickedTraitTroop(prevClicked => prevClicked === troop.name ? null : troop.name);
    setClickedTroop(null); // 다른 영역 클릭 상태 해제
  };

  // 유닛 이미지에서 troopId 추출 함수
  const getTroopId = (troop: Troop): string => {
    return troop.image.split('/').pop()?.replace('.webp', '') || '';
  };

  // 유닛 상세 페이지로 이동
  const navigateToTroopDetail = (troop: Troop) => {
    const troopId = getTroopId(troop);
    navigate(`/troops/${troopId}`);
  };

  // 유닛 추가 함수
  const addTroop = (troop: Troop) => {
    if (selectedDeck.length >= 7) return;
    setSelectedDeck(prev => [...prev, troop]);
    setClickedTroop(null); // 버튼 숨기기
  };

  // 유닛 제거 함수
  const removeTroop = (troop: Troop) => {
    setSelectedDeck(prev => prev.filter(t => t.name !== troop.name));
    setClickedTroop(null); // 버튼 숨기기
  };

  // 유닛이 선택되었는지 확인
  const isTroopsSelected = (troop: Troop): boolean => {
    return selectedDeck.some(t => t.name === troop.name);
  };

  // 선택되지 않은 유닛들 필터링
  const unselectedTroops = troops.filter(troop => !isTroopsSelected(troop));

  // 선택된 덱을 원본 JSON 순서대로 정렬
  const sortedSelectedDeck = selectedDeck.sort((a, b) => {
    const indexA = troops.findIndex(troop => troop.name === a.name);
    const indexB = troops.findIndex(troop => troop.name === b.name);
    return indexA - indexB;
  });

  // 현재 덱의 특성들 계산 (1명 이상부터 표시)
  const calculateTraits = () => {
    const traitCounts: Record<string, number> = {};
    
    // 각 특성별로 유닛 수 카운트
    selectedDeck.forEach(troop => {
      // 출신 특성
      if (troop.origin_trait) {
        traitCounts[troop.origin_trait] = (traitCounts[troop.origin_trait] || 0) + 1;
      }
      // 역할 특성
      if (troop.role_trait) {
        traitCounts[troop.role_trait] = (traitCounts[troop.role_trait] || 0) + 1;
      }
    });

    // 1명 이상 있는 모든 특성 찾기
    const allTraits: Array<{trait: Trait, count: number, requiredCount: number, isActive: boolean}> = [];
    
    Object.entries(traitCounts).forEach(([traitName, count]) => {
      const trait = traits.find(t => t.name === traitName);
      if (trait && trait.effects && count > 0) {
        // 시너지 활성화 여부는 첫 번째 조건으로 판단
        const isActive = count >= trait.effects[0].count;
        
        // 표시는 항상 마지막 요구사항으로 고정
        const requiredCount = trait.effects[trait.effects.length - 1].count;
        
        allTraits.push({
          trait,
          count,
          requiredCount,
          isActive
        });
      }
    });

    // traits.json 순서대로 정렬하되, 활성화된 것과 비활성화된 것 구분
    allTraits.sort((a, b) => {
      const indexA = traits.findIndex(t => t.name === a.trait.name);
      const indexB = traits.findIndex(t => t.name === b.trait.name);
      return indexA - indexB;
    });

    // 활성화된 특성과 비활성화된 특성으로 분리
    const activeTraits = allTraits.filter(trait => trait.isActive);
    const inactiveTraits = allTraits.filter(trait => !trait.isActive);

    // 활성화된 특성을 먼저, 그 다음 비활성화된 특성
    return [...activeTraits, ...inactiveTraits];
  };

  const currentTraits = calculateTraits();

  // 반응형 패딩 값
  const buttonPadding = isMobile ? '8px' : '16px';

  // 홈버튼 클릭 (상태 초기화)
  const handleHomeClick = () => {
    setSelectedDeck([]);
    setClickedTroop(null);
    setClickedTrait(null);
    setClickedTraitTroop(null);
    navigate('/', { replace: true }); // URL도 홈으로 리셋
  };

      if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1b1c3c' }}>
          <div className="text-2xl text-white">{language === 'ko' ? '데이터 로딩중...' : 'Loading data...'}</div>
        </div>
      );
    }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center" style={{ backgroundColor: '#1b1c3c' }}>
      <div className="w-full max-w-7xl">
        {/* 네비게이션 */}
        <Navigation 
          language={language}
          onLanguageChange={handleLanguageChange}
          isMobile={isMobile}
          onHomeClick={handleHomeClick}
        />
        
        {/* 현재 선택한 덱 */}
        <div className="shadow-lg mb-8" style={{ backgroundColor: '#234d7d', padding: buttonPadding }}>
          <div className="grid grid-cols-4 md:grid-cols-8">
            {/* 선택된 유닛들 */}
            {sortedSelectedDeck.map((troop) => {
              const originTrait = findTraits(troop.origin_trait);
              const roleTrait = findTraits(troop.role_trait);
              const isClicked = clickedTroop === troop.name;
              
              return (
                <div key={troop.name} className="relative flex flex-col items-center">
                  <div className="cursor-pointer" onClick={() => handleTroopClick(troop)}>
                    <TroopCard 
                      troop={troop} 
                      originTrait={originTrait}
                      roleTrait={roleTrait}
                      isMobile={isMobile}
                    />
                  </div>
                  {isClicked && (
                    <div className={`absolute top-0 w-full bg-gray-800 rounded-lg z-50 ${isMobile ? 'right-0' : 'left-0'}`} style={{ padding: '0' }}>
                      <div className="cursor-pointer" onClick={() => handleTroopClick(troop)}>
                        <TroopCard 
                          troop={troop} 
                          originTrait={originTrait}
                          roleTrait={roleTrait}
                          isMobile={isMobile}
                        />
                      </div>
                      <div style={{ padding: `0 ${buttonPadding} ${buttonPadding}`, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <button 
                          className="h-10 bg-blue-500 text-white rounded font-bold"
                          style={{ width: '100%', marginBottom: '8px' }}
                          onClick={() => navigateToTroopDetail(troop)}
                        >
                          {language === 'ko' ? '정보' : 'Info'}
                        </button>
                        <button 
                          className="h-10 bg-red-500 text-white rounded font-bold"
                          style={{ width: '100%' }}
                          onClick={() => removeTroop(troop)}
                        >
                          {language === 'ko' ? '삭제' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* 빈 카드 슬롯 (7개 미만일 때만 1개 표시) */}
            {selectedDeck.length < 7 && (
              <div className="w-full aspect-[5/6] flex items-center justify-center">
                <div className="w-[85%] aspect-[5/6] border-2 border-dashed border-gray-400 rounded-[12px] flex items-center justify-center bg-gray-600/20">
                  <div className="text-gray-400 text-lg">+</div>
                </div>
              </div>
            )}

            {/* 덱 공유 버튼 (6개 이상일 때 8번째 칸에 표시) */}
            {selectedDeck.length >= 6 && (
              <div className="w-full aspect-[5/6] flex items-center justify-center">
                <div className="w-[85%] aspect-[5/6] flex flex-col" style={{ gap: '4px' }}>
                  {/* 덱 복사 버튼 (위쪽 절반) */}
                  <div className="flex-1 rounded-[12px] flex items-center justify-center cursor-pointer transition-colors"
                       style={{ 
                         backgroundColor: '#1e3a66',
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.backgroundColor = '#1a3456';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.backgroundColor = '#1e3a66';
                       }}
                       onClick={() => {
                         // URL 복사로 덱 공유
                         const code = deckToCode(selectedDeck);
                         const shareUrl = `${window.location.origin}/deck/${code}`;
                         navigator.clipboard.writeText(shareUrl);
                         alert(language === 'ko' ? '덱 공유 URL이 클립보드에 복사되었습니다!' : 'Deck share URL copied to clipboard!');
                       }}
                       title={language === 'ko' ? '덱 공유' : 'Share Deck'}>
                    <div className="text-white text-sm font-bold text-center">
                      {language === 'ko' ? '덱복사' : 'Copy Deck'}
                    </div>
                  </div>
                  
                  {/* 초기화 버튼 (아래쪽 절반) */}
                  <div className="flex-1 rounded-[12px] flex items-center justify-center cursor-pointer transition-colors"
                       style={{ 
                         backgroundColor: '#1e3a66',
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.backgroundColor = '#1a3456';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.backgroundColor = '#1e3a66';
                       }}
                       onClick={() => {
                         setSelectedDeck([]);
                         setClickedTroop(null);
                         setClickedTrait(null);
                         setClickedTraitTroop(null);
                         navigate('/', { replace: true });
                       }}
                       title={language === 'ko' ? '덱 초기화' : 'Reset Deck'}>
                    <div className="text-white text-sm font-bold text-center">
                      {language === 'ko' ? '초기화' : 'Reset'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 덱의 특성들 */}
        {currentTraits.length > 0 && (
          <div className="shadow-lg mb-8" style={{ backgroundColor: '#2a3a5c', padding: buttonPadding }}>
            <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
              {currentTraits.map((traitData, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <div 
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleTraitClick(traitData.trait.name)}
                    title={`${traitData.trait.name} 정보 보기`}
                  >
                    <img 
                      src={traitData.trait.image} 
                      alt={traitData.trait.name}
                      className={`w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/20 ${
                        traitData.isActive ? '' : 'grayscale'
                      }`}
                    />
                    <div className={`absolute -bottom-1 -right-2 md:-right-3 text-xs md:text-base font-bold rounded-[6px] md:rounded-[10px] min-w-[20px] md:min-w-[28px] text-center ${
                      traitData.isActive 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {traitData.count}/{traitData.requiredCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 특성 상세 영역 (고정 영역) */}
        {clickedTrait && (
          <div className="shadow-lg mb-8" style={{ backgroundColor: '#234d7d', padding: buttonPadding }}>
            {(() => {
              const traitData = currentTraits.find(t => t.trait.name === clickedTrait);
              if (!traitData) return null;
              
              return (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={traitData.trait.image} 
                      alt={traitData.trait.name}
                      className="w-12 h-12 rounded-full bg-black/20"
                    />
                    <div>
                      <h3 className="text-white font-bold text-xl">{traitData.trait.name}</h3>
                    </div>
                  </div>
                  
                  {/* 특성 설명 */}
                  <p 
                    className="text-gray-200 mb-4" 
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}
                  >
                    {traitData.trait.description}
                  </p>
                  
                  {/* 특성 효과들 */}
                  <div className="space-y-2 mb-4">
                    {traitData.trait.effects?.map((effect, effectIndex) => (
                      <div 
                        key={effectIndex}
                        style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px' }}
                      >
                        <div className="flex">
                          <span 
                            className={`font-semibold flex-shrink-0 ${
                              traitData.count >= effect.count 
                                ? 'text-white' 
                                : 'text-gray-400'
                            }`}
                            style={{ marginRight: '16px' }}
                          >
                            [{effect.count}]
                          </span>
                          <span className={`font-semibold ${
                            traitData.count >= effect.count 
                              ? 'text-white' 
                              : 'text-gray-400'
                          }`}>
                            {effect.effect}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 해당되는 유닛들 */}
                  <div className="grid grid-cols-4">
                    {troops
                      .filter(troop => 
                        troop.origin_trait === traitData.trait.name || troop.role_trait === traitData.trait.name
                      )
                      .map((troop) => {
                        const originTrait = findTraits(troop.origin_trait);
                        const roleTrait = findTraits(troop.role_trait);
                        const isSelected = selectedDeck.some(selected => selected.name === troop.name);
                        const isClicked = clickedTraitTroop === troop.name;
                        
                        return (
                          <div key={troop.name} className="relative flex flex-col items-center">
                            <div 
                              className="cursor-pointer" 
                              style={{ filter: !isSelected ? 'grayscale(100%)' : 'none' }}
                              onClick={() => handleTraitTroopClick(troop)}
                            >
                              <TroopCard 
                                troop={troop} 
                                originTrait={originTrait}
                                roleTrait={roleTrait}
                                isMobile={isMobile}
                              />
                            </div>
                            {isClicked && (
                              <div className={`absolute top-0 w-full bg-gray-800 rounded-lg z-50 ${isMobile ? 'right-0' : 'left-0'}`} style={{ padding: '0' }}>
                                <div 
                                  className="cursor-pointer" 
                                  style={{ filter: !isSelected ? 'grayscale(100%)' : 'none' }}
                                  onClick={() => handleTraitTroopClick(troop)}
                                >
                                  <TroopCard 
                                    troop={troop} 
                                    originTrait={originTrait}
                                    roleTrait={roleTrait}
                                    isMobile={isMobile}
                                  />
                                </div>
                                <div style={{ padding: `0 ${buttonPadding} ${buttonPadding}`, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                  <button 
                                    className="h-10 bg-blue-500 text-white rounded font-bold"
                                    style={{ width: '100%', marginBottom: '8px' }}
                                    onClick={() => navigateToTroopDetail(troop)}
                                  >
                                    {language === 'ko' ? '정보' : 'Info'}
                                  </button>
                                  {isSelected ? (
                                    <button 
                                      className="h-10 bg-red-500 text-white rounded font-bold"
                                      style={{ width: '100%' }}
                                      onClick={() => removeTroop(troop)}
                                    >
                                      {language === 'ko' ? '삭제' : 'Remove'}
                                    </button>
                                  ) : (
                                    <button 
                                      className="h-10 bg-green-500 text-white rounded font-bold disabled:bg-gray-400"
                                      style={{ width: '100%' }}
                                      onClick={() => addTroop(troop)}
                                      disabled={selectedDeck.length >= 7}
                                    >
                                      {language === 'ko' ? '사용' : 'Use'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    }
                    {troops.filter(troop => 
                      troop.origin_trait === traitData.trait.name || troop.role_trait === traitData.trait.name
                    ).length === 0 && (
                      <div className="col-span-full text-center text-gray-400 py-4">
                        {language === 'ko' ? '해당되는 유닛이 없습니다' : 'No units available'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 유닛 선택 */}
        <div className="shadow-lg" style={{ backgroundColor: '#1b1c3c', padding: buttonPadding, paddingBottom: '10rem' }}>
          <div className="grid grid-cols-4 md:grid-cols-8">
            {unselectedTroops.map((troop) => {
              const originTrait = findTraits(troop.origin_trait);
              const roleTrait = findTraits(troop.role_trait);
              const isClicked = clickedTroop === troop.name;
              
              return (
                <div key={troop.name} className="relative flex flex-col items-center">
                  <div className="cursor-pointer" onClick={() => handleTroopClick(troop)}>
                    <TroopCard 
                      troop={troop} 
                      originTrait={originTrait}
                      roleTrait={roleTrait}
                      isMobile={isMobile}
                    />
                  </div>
                  {isClicked && (
                    <div className={`absolute top-0 w-full bg-gray-800 rounded-lg z-50 ${isMobile ? 'right-0' : 'left-0'}`} style={{ padding: '0' }}>
                      <div className="cursor-pointer" onClick={() => handleTroopClick(troop)}>
                        <TroopCard 
                          troop={troop} 
                          originTrait={originTrait}
                          roleTrait={roleTrait}
                          isMobile={isMobile}
                        />
                      </div>
                      <div style={{ padding: `0 ${buttonPadding} ${buttonPadding}`, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <button 
                          className="h-10 bg-blue-500 text-white rounded font-bold"
                          style={{ width: '100%', marginBottom: '8px' }}
                          onClick={() => navigateToTroopDetail(troop)}
                        >
                          {language === 'ko' ? '정보' : 'Info'}
                        </button>
                        <button 
                          className="h-10 bg-green-500 text-white rounded font-bold disabled:bg-gray-400"
                          style={{ width: '100%' }}
                          onClick={() => addTroop(troop)}
                          disabled={selectedDeck.length >= 7}
                        >
                          {language === 'ko' ? '사용' : 'Use'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
