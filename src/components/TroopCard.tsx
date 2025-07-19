import type { Troop, Trait } from '../types';

interface TroopCardProps {
  troop: Troop;
  originTrait?: Trait;
  roleTrait?: Trait;
  isMobile?: boolean;
}

export default function TroopCard({ troop, originTrait, roleTrait, isMobile = false }: TroopCardProps) {
  const getElixirImagePath = (elixir: number) => `/images/elixir/elixir_${elixir}.png`;

  const elixirGradients: Record<number, string> = {
    2: 'from-green-500/90 to-transparent',
    3: 'from-blue-500/90 to-transparent', 
    4: 'from-purple-500/90 to-transparent',
    5: 'from-yellow-400/90 to-transparent',
  };
  
  const elixirGradient = elixirGradients[troop.elixir] || 'from-gray-400/90 to-transparent';
  
  // 모바일과 데스크톱에 따른 테두리 두께
  const borderWidth = isMobile ? 3 : 6;

  return (
    <div className="relative w-full aspect-[5/6] flex items-center justify-center overflow-hidden">

      {/* 엘릭서 아이콘 */}
      <div className="absolute top-0 left-0 w-[24%] z-30">
        <img
          src={getElixirImagePath(troop.elixir)}
          alt="엘릭서"
          className="w-full h-auto object-contain drop-shadow-lg"
        />
      </div>

      {/* 카드 본체 */}
      <div 
        className="relative w-[85%] aspect-[5/6] rounded-[12px] overflow-hidden border-black"
        style={{ borderWidth: `${borderWidth}px` }}
      >

        {/* 이미지 안쪽 밝은 투명 테두리 */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div 
            className="absolute rounded-[6px] border-white/30" 
            style={{ 
              inset: '0px',
              borderWidth: `${borderWidth}px`
            }}
          />
        </div>

        {/* 하단 그라데이션 색상 */}
        <div className={`absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t ${elixirGradient} z-10 pointer-events-none`} />

        <img
          src={troop.image}
          className="w-full h-full object-cover z-0"
        />

        {/* 특성 아이콘 - 하단 중앙, 카드 비율에 맞춰 고정 크기 */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-[8%] z-20">
          {originTrait && (
            <div className="w-[100%] aspect-square rounded-full bg-black/70 backdrop-blur-md border border-white/20 overflow-hidden shadow-lg">
              <img src={originTrait.image} alt={originTrait.name} className="w-full h-full object-cover" />
            </div>
          )}
          {roleTrait && (
            <div className="w-[100%] aspect-square rounded-full bg-black/70 backdrop-blur-md border border-white/20 overflow-hidden shadow-lg">
              <img src={roleTrait.image} alt={roleTrait.name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
