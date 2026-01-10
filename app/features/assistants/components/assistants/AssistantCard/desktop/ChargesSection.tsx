'use client';

import React from 'react';
import { PlugZap } from 'lucide-react';
import { Section } from './Section';
import { Metric } from './Metric';

export function ChargesSection({ charges }: { charges?: any }) {
  return (
    <Section title="Charges">
      <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-6">
        <Metric icon={<PlugZap className="w-4 h-4" />} value={charges?.inUse ?? 0} label="In use" dotClass="bg-green-500" />
        <Metric icon={<PlugZap className="w-4 h-4" />} value={charges?.free ?? 0} label="Free" dotClass="bg-blue-400" />
        <Metric icon={<PlugZap className="w-4 h-4" />} value={charges?.offline ?? 0} label="Offline" dotClass="bg-gray-300" />
      </div>
    </Section>
  );
}
