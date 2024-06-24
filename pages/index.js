import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session?.user);
  return (
    <div className="text-primary flex items-center justify-between sm:mr-0 mr-[70px]">
      Hello, {session?.user?.name}
      <img
        className="size-12 object-cover rounded-full"
        src={session?.user?.image}
        alt=""
      />
    </div>
  );
}
