import { AlignLeft, Info, List, PanelTopClose, Star } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function MainNav() {
  return (
    <div className="h-screen bg-zinc-100 dark:bg-zinc-700">
      <div className="h-full flex items-center flex-col gap-4 mx-auto p-4">
        <PanelTopClose className="rotate-90 cursor-pointer mb-4" />

        <AlignLeft className="cursor-pointer" />
        <Star className="cursor-pointer" />

        <ThemeToggle className="mt-auto" />
        <Info className="cursor-pointer" />
      </div>
    </div>
  );
}
