//src/components/ui/gradient-user-button.tsx

"use client"

import { UserButton } from "@civic/auth/react"

interface GradientUserButtonProps {
  className?: string
}

export function GradientUserButton({ className = '' }: GradientUserButtonProps) {
  const wrapperStyles = `
    inline-flex items-center justify-center 
    bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 
    hover:from-cyan-600 hover:via-sky-600 hover:to-blue-700 
    text-white px-1 py-1 rounded-lg 
    transition-all duration-200 text-base min-h-[40px]
  `
  
  const userButtonOverrides = `
    [&>*]:!bg-transparent 
    [&>*]:!border-none 
    [&>*]:!text-white 
    [&>*]:!p-0 
    [&>*]:!m-0 
    [&>*]:!font-medium 
    [&>*]:!text-sm 
    [&>*]:!leading-none 
    [&>button]:!bg-transparent 
    [&>button]:!border-none 
    [&>button]:!text-white 
    [&>button]:!p-0 
    [&>button]:!m-0 
    [&>button]:!font-medium 
    [&>button]:!text-sm 
    [&>button]:!leading-none 
    [&>button]:!min-h-0 
    [&>button]:!h-auto    
    [&>button]:!text-base 
    [&>button>div>span]:!text-base
    [&>button>div>span]:!text-white
    [&_span]:!text-white
    [&_p]:!text-white
    [&_div]:!text-white
    [&>button>*]:!text-white
    [&>button>div>*]:!text-white
    [&>button>div>div>*]:!text-white
    [&>button>div>div>span]:!text-white
    [&>button>div>div>div>span]:!text-white
  `

  return (
    <div className={`${wrapperStyles} ${userButtonOverrides} ${className}`}>
      <UserButton />
    </div>
  )
}
