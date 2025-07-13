"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RatingProps {
  rating: number;
  setRating: (rating: number) => void;
  maxRating?: number;
  className?: string;
}

export function Rating({
  rating,
  setRating,
  maxRating = 5,
  className,
}: RatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating ?? rating);

        return (
          <Button
            key={starValue}
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(null)}
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "h-5 w-5",
                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              )}
            />
          </Button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "No rating"}
      </span>
    </div>
  );
}