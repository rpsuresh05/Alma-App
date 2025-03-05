import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      {/* <h1 className="text-3xl font-bold tracking-tighter">almǎ</h1> */}
      <Image src="/alma.png" alt="Almǎ Logo" width={100} height={32} />
    </Link>
  );
}
