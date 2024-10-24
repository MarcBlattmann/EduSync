import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ThemeToggle";
import Link from 'next/link'

export default function NavBar() { 

  return (
    <div className="pt-5 pb-5 pr-6 pl-6 flex justify-between items-center">
      <div className="text-xl font-bold">EduSync</div>
      <div className="flex gap-3">
        <ModeToggle />
          <Button disabled variant="outline">
            Register
          </Button>
        
          <Button disabled>Login</Button>
      </div>
    </div>
  );
}
