import React, { useState } from 'react';
import { X, Plus, Minus, Popcorn, Check } from 'lucide-react';
import { SnackOrder } from '../../types';
import { MOCK_SNACKS } from '../../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedSnacks: SnackOrder[];
  onSaveSnacks: (snacks: SnackOrder[]) => void;
}

export const SnackSelectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedSnacks,
  onSaveSnacks,
}) => {
  const [quantities, setQuantities] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    selectedSnacks.forEach((s) => {
      map[s.snackId] = s.quantity;
    });
    return map;
  });

  if (!isOpen) return null;

  const updateQuantity = (snackId: number, delta: number) => {
    const current = quantities[snackId] || 0;
    const next = Math.max(0, current + delta);
    setQuantities({ ...quantities, [snackId]: next });
  };

  const handleSave = () => {
    const result: SnackOrder[] = [];
    Object.keys(quantities).forEach((idStr) => {
      const id = Number(idStr);
      const qty = quantities[id];
      if (qty > 0) {
        const item = MOCK_SNACKS.find((s) => s.id === id);
        if (item) {
          result.push({
            snackId: item.id,
            snackName: item.name,
            quantity: qty,
            unitPrice: item.price,
          });
        }
      }
    });

    onSaveSnacks(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 text-slate-100 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 shrink-0">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Popcorn className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Sinema Büfesi & Menüler</h3>
            <p className="text-xs text-slate-400">Film keyfinizi lezzetli menülerle taçlandırın</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {MOCK_SNACKS.map((snack) => {
            const qty = quantities[snack.id] || 0;
            return (
              <div
                key={snack.id}
                className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 flex items-center gap-3"
              >
                <img
                  src={snack.imageUrl}
                  alt={snack.name}
                  className="w-16 h-16 object-cover rounded-xl shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-white truncate">{snack.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {snack.description}
                  </p>
                  <p className="text-xs font-black text-amber-400 mt-1">₺{snack.price}</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(snack.id, -1)}
                    disabled={qty === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center text-white">{qty}</span>
                  <button
                    onClick={() => updateQuantity(snack.id, 1)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/20"
          >
            Seçimi Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
