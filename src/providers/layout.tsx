"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import Link from "next/link";
import {
  CircleUser,
  LineChart,
  Map,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const unauthorizedPaths = ["/", "/cadastrar"];

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!loading && !user && !unauthorizedPaths.includes(path)) {
      router.push("/");
    }
  }, [user, loading]);

  if (loading) return null;
  if (!user && unauthorizedPaths.includes(path)) return children;

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block bg-white">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 ">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">{user?.name.split(" ")[0]}</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/mapa"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/mapa" ? "bg-muted" : ""}`}
              >
                <Map className="h-4 w-4" />
                Mapa
              </Link>
              <Link
                href="/pedidos"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/pedidos" ? "bg-muted" : ""}`}
              >
                <ShoppingCart className="h-4 w-4" />
                Pedidos
              </Link>
              <Link
                href="/produtos"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/produtos" ? "bg-muted" : ""}`}
              >
                <Package className="h-4 w-4" />
                Produtos
              </Link>
              <Link
                href="/clientes"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/clientes" ? "bg-muted" : ""}`}
              >
                <Users className="h-4 w-4" />
                Clientes
              </Link>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/dashboard" ? "bg-muted" : ""}`}
              >
                <LineChart className="h-4 w-4" />
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-screen items-start justify-start">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 w-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Mostrar menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="">{user?.name.split(" ")[0]}</span>
                </Link>
              </div>
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/mapa"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/mapa" ? "bg-muted" : ""}`}
                >
                  <Map className="h-4 w-4" />
                  Mapa
                </Link>
                <Link
                  href="/pedidos"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/pedidos" ? "bg-muted" : ""}`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Pedidos
                </Link>
                <Link
                  href="/produtos"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/produtos" ? "bg-muted" : ""}`}
                >
                  <Package className="h-4 w-4" />
                  Produtos
                </Link>
                <Link
                  href="/clientes"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/clientes" ? "bg-muted" : ""}`}
                >
                  <Users className="h-4 w-4" />
                  Clientes
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                  ${path === "/dashboard" ? "bg-muted" : ""}`}
                >
                  <LineChart className="h-4 w-4" />
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 flex-1 max-h-full h-full overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
