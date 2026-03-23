import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground lg:h-20 lg:w-20">
        <Compass className="h-8 w-8 lg:h-10 lg:w-10" />
      </div>
      <h1 className="text-3xl font-bold text-foreground lg:text-4xl">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Oops, This quest doesn't exist.
      </p>
      <Button asChild className="mt-6 btn-quest">
        <Link to="/quests">Return to Quests</Link>
      </Button>
    </div>
  );
};

export default NotFound;
