import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F4F4]">
      <Card className="w-full max-w-md mx-4 border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-[#800020]" />
            <h1 className="text-2xl font-bold text-[#0D0D0D] font-playfair">404 Page Not Found</h1>
          </div>

          <p className="mt-4 mb-6 text-sm text-[#333333]">
            We couldn't find the page you're looking for. Let us guide you back to our luxurious offerings.
          </p>
          
          <Link href="/">
            <Button className="w-full bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] uppercase tracking-wider text-sm">
              Return to Homepage
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
