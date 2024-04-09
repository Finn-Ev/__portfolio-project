'use client';

import { PulseLoader } from 'react-spinners';

export default function Loading() {
  return (
    // TODO apply theme colors
    <div className="flex h-full items-center justify-center">
      <PulseLoader color="#000" />
    </div>
  );
}
