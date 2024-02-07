interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center -mt-6">
      <span className="font-bold text-lg text-destructive">{message}</span>
      Please try again later.
    </div>
  );
}
