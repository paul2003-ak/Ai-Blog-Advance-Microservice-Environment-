"use client"
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { blog_service } from "./AppContext";
import Cookies from "js-cookie";

interface SavedContextValue{
    savedBlogs: SaveblogType[] | null;
    fetchSaveBlogs:()=>Promise<void>
}

export const savecontext=createContext<SavedContextValue | undefined>(undefined)

interface SaveblogType{
    id:string;
    userid:string;
    blogid:string;
    created_at:string;
}

interface SavedBLogProps{
    children:React.ReactNode
}

export const SavedBlogProvider: React.FC<SavedBLogProps> = ({children}) => {

    const [savedBlogs, setSavedBlogs] = useState<SaveblogType[] | null>(null)

    const fetchSaveBlogs=async()=>{
        try {
            const token=Cookies.get("token")
            
            const result=await axios.get<{blogs:SaveblogType[]}>(`${blog_service}/api/v2/get/savedblogs`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            setSavedBlogs(result.data.blogs)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
       const id=setTimeout(() => {
         fetchSaveBlogs();
       }, 0);

       return ()=>clearTimeout(id)
    },[])

    return(
        <savecontext.Provider value={{savedBlogs,fetchSaveBlogs }}>
            {children}
        </savecontext.Provider>
    )
}

export const useSavedBlogsData=():SavedContextValue=>{
    const context = useContext(savecontext);
    if(context===undefined){
        throw new Error("useBlogData must be used within a BlogProvider");
    }
    return context;
}
