import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="ml-auto flex gap-4 sm:gap-6">
            {/* <Link
              href="/assessment"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Get Assessment
            </Link> */}
            <Link
              href="/admin"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Immigration Case Assessment
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Get a professional assessment of your immigration case from
                  our team of experienced attorneys.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild className="bg-[#1B1B1B] hover:bg-[#1B1B1B]/90">
                  <Link href="/assessment">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 text-center">
            © 2025 Almǎ Immigration. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
