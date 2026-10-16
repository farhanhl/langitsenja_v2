'use client';

import { useState } from 'react';
import { VENDORS, type VendorItem } from '@/game/vendors';
import { useUiStore } from '@/store/uiStore';
import { usePlayerStore } from '@/store/playerStore';
import { useGameStore } from '@/store/gameStore';

export default function VendorShop() {
  const vendorShopId = useUiStore((s) => s.vendorShopId);
  const closeVendorShop = useUiStore((s) => s.closeVendorShop);

  const money = usePlayerStore((s) => s.money);
  const spendMoney = usePlayerStore((s) => s.spendMoney);
  const applyBuff = usePlayerStore((s) => s.applyBuff);

  const missions = useGameStore((s) => s.missions);

  const [message, setMessage] = useState<string | null>(null);

  if (!vendorShopId) return null;

  const vendor = VENDORS.find((v) => v.id === vendorShopId);
  if (!vendor) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleBuy = (item: VendorItem) => {
    const success = spendMoney(item.price);
    if (!success) {
      setMessage('Waduh, uang jajan kamu kurang nih! Cari jajanan lain yuk.');
      return;
    }

    // Terapkan efek jajanan
    let hintText = '';
    if (item.effect === 'hint' || item.effect === 'sprint_and_hint') {
      const remainingFriend = missions.find((m) => !m.found);
      if (remainingFriend) {
        hintText = `Kata ${vendor.name}: "Tadi gue liat si ${remainingFriend.name} ${remainingFriend.locationDesc}"`;
      } else {
        hintText = `Kata ${vendor.name}: "Wah, kayaknya temen-temen kamu udah pada ketemu semua deh!"`;
      }
    }

    if (item.effect === 'sprint_boost') {
      applyBuff('sprint_boost', item.effectDuration || 20);
      setMessage(`Nyam! ${item.name} seger banget! Lari kamu jadi 25% lebih kencang! ⚡`);
    } else if (item.effect === 'hint') {
      applyBuff('hint', 30, hintText);
      setMessage(`${hintText}`);
    } else if (item.effect === 'sprint_and_hint') {
      applyBuff('sprint_and_hint', item.effectDuration || 25, hintText);
      setMessage(`Mantap! Lari lebih kencang + petunjuk: "${hintText}"`);
    } else {
      setMessage(`Nyam! Menikmati ${item.name} hangat di waktu senja.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-lg bg-[#F5E9D3] border-4 border-[#2B1D14] rounded-lg shadow-[8px_8px_0px_#2B1D14] p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header Warung Pedagang */}
        <div className="flex items-center justify-between border-b-2 border-[#2B1D14]/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-2xl text-[#2B1D14] leading-tight">
                {vendor.name}
              </h2>
              <span className="bg-[#E8743B] text-white text-[10px] font-bold px-2 py-0.5 rounded font-display uppercase tracking-wider">
                Menu Keliling
              </span>
            </div>
            <p className="font-body text-xs text-[#2B1D14]/70 mt-0.5">
              Jajan sore biar bertenaga nyari temen-temen!
            </p>
          </div>

          {/* Saldo Uang Jajan */}
          <div className="bg-[#2B1D14] px-3 py-1.5 rounded border border-[#F2B632] text-right">
            <span className="text-[10px] text-[#F5E9D3]/70 font-semibold uppercase block">
              Uang Kamu
            </span>
            <span className="font-display font-black text-base text-[#F2B632] leading-none">
              {formatRupiah(money)}
            </span>
          </div>
        </div>

        {/* Notifikasi / Feedback Pembelian */}
        {message && (
          <div className="bg-[#FFF9E6] border-2 border-[#E8743B] p-3 rounded text-xs font-semibold text-[#2B1D14] font-body flex items-start gap-2 shadow-sm animate-pulse">
            <span className="text-base">📢</span>
            <p className="flex-1">{message}</p>
            <button
              onClick={() => setMessage(null)}
              className="text-[#2B1D14]/50 hover:text-[#2B1D14] font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Daftar Menu Jajanan */}
        <div className="flex flex-col gap-2.5">
          {vendor.menu.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-[#2B1D14]/25 hover:border-[#E8743B] p-3.5 rounded-lg flex items-center justify-between gap-3 transition-colors shadow-sm"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-lg text-[#2B1D14]">
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-[#A23B2A] font-body">
                    {formatRupiah(item.price)}
                  </span>
                </div>
                <p className="font-body text-xs text-[#2B1D14]/75">
                  {item.effectDesc}
                </p>
              </div>

              <button
                onClick={() => handleBuy(item)}
                disabled={money < item.price}
                className={`btn-plang text-xs px-4 py-2 cursor-pointer shadow-[2px_2px_0px_#2B1D14] whitespace-nowrap ${
                  money < item.price ? 'opacity-50 cursor-not-allowed bg-gray-400' : ''
                }`}
              >
                Beli
              </button>
            </div>
          ))}
        </div>

        {/* Footer Tombol Tutup */}
        <div className="pt-2 border-t-2 border-[#2B1D14]/15 flex justify-end">
          <button
            onClick={closeVendorShop}
            className="btn-plang btn-secondary text-xs sm:text-sm px-5 py-2 cursor-pointer shadow-[2px_2px_0px_#2B1D14]"
          >
            Tutup Menu
          </button>
        </div>
      </div>
    </div>
  );
}
