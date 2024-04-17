export default function PageHeader({
  title,
  actionButton,
}: {
  title: string;
  actionButton?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center w-full mb-8 md:mb-4 h-12">
      <h1 className="font-semibold text-lg text-center md:text-start mb-1">{title}</h1>
      {actionButton}
    </div>
  );
}
