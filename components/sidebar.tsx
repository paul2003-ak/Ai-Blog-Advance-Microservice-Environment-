"use client"
import React, { use } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Input } from './ui/input'
import { BoxSelect } from 'lucide-react'
import { useBlogData } from '@/context/BlogContext';

const blogCategories = [
  "Technology",
  "Health",
  "Finance",
  "Travel",
  "Education",
  "Entertainment",
  "study",
];


const SideBar = () => {
    const {searchquery, setSearchquery, setCategory} = useBlogData();
  return (
    <Sidebar>
        <SidebarHeader className=' bg-white text-2xl font-bold mt-5'>
            The Reading Retreat
            <SidebarContent className=' bg-white  '>
                <SidebarGroup>
                    
                    <SidebarGroupLabel>search</SidebarGroupLabel>
                    <Input type='text' value={searchquery} onChange={(e)=>setSearchquery(e.target.value)} placeholder='Search blogs...' className=' mb-4 '/>

                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarMenu>

                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={()=>setCategory("")}>
                                <BoxSelect/><span>All</span>
                            </SidebarMenuButton>
                            {
                                blogCategories.map((category,idx) => (
                                    <SidebarMenuButton key={idx} onClick={()=>setCategory(category)}>
                                        <BoxSelect />
                                        <span>{category}</span>
                                    </SidebarMenuButton>
                                ))
                            }
                        </SidebarMenuItem>

                    </SidebarMenu>

                </SidebarGroup>
            </SidebarContent>
        </SidebarHeader>
    </Sidebar>
  )
}

export default SideBar

