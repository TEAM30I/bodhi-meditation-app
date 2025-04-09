
import * as React from "react";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GuestSelectorProps {
  adults: number;
  children: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
}

export function GuestSelector({ 
  adults, 
  children, 
  onAdultsChange, 
  onChildrenChange 
}: GuestSelectorProps) {
  const totalGuests = adults + children;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal w-full bg-[#F5F5F5] border-none"
        >
          <Users className="mr-2 h-4 w-4 text-gray-500" />
          <span>{`성인 ${adults}명${children > 0 ? `, 아동 ${children}명` : ''}`}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">성인</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                disabled={adults <= 1}
              >
                -
              </Button>
              <span className="w-8 text-center">{adults}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onAdultsChange(adults + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">아동</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onChildrenChange(Math.max(0, children - 1))}
                disabled={children <= 0}
              >
                -
              </Button>
              <span className="w-8 text-center">{children}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onChildrenChange(children + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
