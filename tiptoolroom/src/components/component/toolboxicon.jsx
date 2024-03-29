/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/0FSlMFe8Kxa
 */
import { Button } from "@/components/ui/button"
import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import Link from 'next/link';


export function Toolboxicon() {
  return (
    <Link href ="/Toolbox">
     <div className="top-0 right-0 m-4">
       <TooltipProvider>
         <Tooltip>
           <TooltipTrigger asChild>
             <div className="flex items-center">
               <Button size="icon" variant="ghost">
                 <BoxIcon className="h-6 w-6" />
                 <span className="sr-only">Open Toolbox</span>
               </Button>
               <span>Toolbox</span>
             </div>
           </TooltipTrigger>
           <TooltipContent>Open Toolbox</TooltipContent>
         </Tooltip>
       </TooltipProvider>
     </div>
     </Link>
  );
 }
 


function BoxIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
    
      <path
        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>)
  );
}
