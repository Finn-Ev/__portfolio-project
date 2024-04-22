'use client';

import { useTheme } from 'next-themes';
import { PulseLoader } from 'react-spinners';

export default function LoadingIndicator({ size = 12, elementHasThemeBackgroundColor = false }) {
  const { theme } = useTheme();

  if (elementHasThemeBackgroundColor) {
    return <PulseLoader size={size} color={theme === 'dark' ? '#FFF' : '#000'} />;
  } else {
    return <PulseLoader size={size} color={theme === 'dark' ? '#000' : '#FFF'} />;
  }
}
