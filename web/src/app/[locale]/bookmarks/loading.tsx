import LoadingIndicator from '@/components/loading-indicator';

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <LoadingIndicator size={16} elementHasThemeBackgroundColor />
    </div>
  );
}
