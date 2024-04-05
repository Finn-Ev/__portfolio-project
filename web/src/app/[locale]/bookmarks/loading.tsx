'use client';

import { Oval } from 'react-loader-spinner';

export default function Loading() {
  return (
    // TODO apply theme colors
    <div className="flex h-full items-center justify-center">
      <Oval
        height="80"
        width="80"
        ariaLabel="oval-loading"
        color="#FFF"
        secondaryColor="#F2F2F2"
        wrapperClass="-mt-5"
      />
    </div>
  );
}
