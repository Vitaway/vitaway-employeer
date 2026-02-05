import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search employees, programs, reports..."
          className="border-0 focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>
      </div>
    </header>
  );
}
