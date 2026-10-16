'use client';

import { VENDORS } from '@/game/vendors';
import VendorNpc from './VendorNpc';

export default function VendorList() {
  return (
    <group>
      {VENDORS.map((vendor) => (
        <VendorNpc key={vendor.id} vendor={vendor} />
      ))}
    </group>
  );
}
