import Sidebar from "@/components/layout/Sidebar";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import DemoRoleSwitcher from "@/components/layout/DemoRoleSwitcher";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  let role = "STUDENT";

  if (user) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
      });
      role = dbUser?.role || "STUDENT";
    } catch (error) {
      console.error("Failed to fetch user role in layout:", error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar role={role} />

      <div className="flex flex-1 flex-col font-sans">
        <header className="flex h-16 items-center justify-between gap-4 px-6 border-b border-gray-800/60 bg-gray-950/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {/* Left side empty or branding */}
          </div>

          <div className="flex items-center gap-4">
            <Show when="signed-in">
              <DemoRoleSwitcher currentRole={role} />
              <UserButton />
            </Show>

            <Show when="signed-out">
              <SignInButton />
              <SignUpButton>
                <button className="h-10 cursor-pointer rounded-full bg-purple-700 px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}