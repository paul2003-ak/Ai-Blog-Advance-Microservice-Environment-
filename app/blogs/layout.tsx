//প্রতিটা ফোল্ডারের ভিতরে আলাদা layout.tsx বানানোর কারণ হলো — 
// ওই ফোল্ডারের ভিতরে যতগুলো পেজ (.tsx ফাইল) থাকবে, সবার জন্য কিছু কমন জিনিস শেয়ার করা যায়। যেমন –
//  একই Sidebar, একই Navbar, একই Layout Structure।
//আরো সহজ করে বললে —
//যে ফোল্ডারের জন্য তুমি layout.tsx বানাবে, সেই ফোল্ডারের সব পেজেই ওই layout apply হবে। 
// তাই আবার-আবার আলাদা করে Navbar / Sidebar লিখতে হয় না।
import SideBar from '@/components/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'


interface BlogProps{
    children: React.ReactNode
}

const HomeLayout: React.FC<BlogProps>= ({children}) => {
  return (
    <div >
        <SidebarProvider>            
        <SideBar/>
        <main className='w-full '>
            <div className=' w-full min-h-[calc(100vh-45)] px-4  '>
                {children}  
            </div>
        </main>
        </SidebarProvider>
    </div>
  )
}

export default HomeLayout
