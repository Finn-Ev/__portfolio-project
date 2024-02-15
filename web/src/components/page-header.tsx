export default function PageHeader({
  title,
  actionButton,
}: {
  title: string;
  actionButton?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center w-full mb-4 h-11">
      <h1 className="font-semibold text-lg">{title}</h1>
      {actionButton}
    </div>
  );
}
