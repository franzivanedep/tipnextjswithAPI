import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";

export default function Tdropdown({ setSelectedCategory }) {
  return (
      <div style={{ textAlign: 'left' }}>
          <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#">
              <DropdownMenu className="margin-left: 15px ">
                  <DropdownMenuTrigger>Filter</DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuLabel>Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedCategory(1)}>Electronics</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCategory(2)}>Computer</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCategory(3)}>Electronics</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCategory(4)}>Electronics</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </Link>
      </div>
  );
}
