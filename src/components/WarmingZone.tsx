interface WarmingZoneProps {
  onProductClick?: (productId: string) => void;
}

export function WarmingZone({ onProductClick }: WarmingZoneProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Зона прогрева</h3>
      
      <div className="grid grid-cols-3 gap-4 h-32">
        {/* Левая часть - 2 блока */}
        <div className="col-span-2 grid grid-rows-2 gap-2">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Рекомендуемый товар 1</span>
          </div>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Рекомендуемый товар 2</span>
          </div>
        </div>
        
        {/* Правая часть - слайдер */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm">Слайдер</span>
        </div>
      </div>
    </div>
  );
}