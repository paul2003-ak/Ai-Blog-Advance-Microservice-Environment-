"use client";
import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { Blog, blog_service } from "./AppContext"

interface BlogContextValue{
    blogs: Array<Blog> | null;
    blogloading: boolean;
    searchquery: string;
    category: string;
    setSearchquery: React.Dispatch<React.SetStateAction<string>>;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    fetchBlogs:()=>Promise<void>
}
export const BlogContext=createContext<BlogContextValue | undefined>(undefined)

interface BlogproviderProps{
    children:React.ReactNode
}

export const Blogprovider:React.FC<BlogproviderProps>=({children})=>{
    const [blogloading, setBlogloading] = useState(false)
    const [blogs, setBlogs] = useState<Array<Blog> | null>(null)//Array bcz lots of blogs will be contained

    const [category, setCategory] = useState("")
    const [searchquery, setSearchquery] = useState("")

    const fetchBlogs=async()=>{
        setBlogloading(true)
        try {
            const result=await axios.get<{blogs:Blog[]}>(`${blog_service}/api/v2/blogs/all?searchQuery=${searchquery}&category=${category}`);
            setBlogs(result.data.blogs);
        } catch (error) {
            console.log(error);
        }finally{
            setBlogloading(false)
        }
    }

    useEffect(()=>{
        fetchBlogs();
    },[searchquery,category])

    return(
        <BlogContext.Provider value={{ blogs, blogloading , searchquery, category,setSearchquery, setCategory , fetchBlogs}}>
            {children}
        </BlogContext.Provider>
    )
};

export const useBlogData=():BlogContextValue=>{
    const context = useContext(BlogContext);
    if(context===undefined){
        throw new Error("useBlogData must be used within a BlogProvider");
    }
    return context;
}