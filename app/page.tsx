import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col text-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center gap-y-2">
        <h3 className="text-xl font-bold">Welcome to Ask This Website!</h3>
        <p className="text-sm">
          Append any website URL to &quot;localhost:3000&quot; to get started.
        </p>
      </div>
    </div>
  );
}
