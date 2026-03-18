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
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-6">
        <Compass className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Oops! This quest doesn't exist.
      </p>
      <Button asChild className="mt-6 btn-quest">
        <Link to="/quests">Return to Quests</Link>
      </Button>
    </div>
  );
};

export default NotFound;
