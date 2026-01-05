"use client"
import BlogCard from '@/components/BlogCard'
import Loading from '@/components/loading'
import { useBlogData } from '@/context/BlogContext'
import { useSavedBlogsData } from '@/context/SaveBlogContext'
import React from 'react'

const SavedBlog = () => {
  const {savedBlogs}=useSavedBlogsData()
  const {blogs}=useBlogData()

  if(!blogs || !savedBlogs){
    return <Loading/>
  }

  //filte all the saved blog 
  //we can not treate as a call back function at the time of filter
  const filteredBlogs=blogs.filter((blog)=>
    savedBlogs.some((saved)=> saved.blogid===blog.id.toString())
  );

  return (
    <div className=' container mx-auto px-4 '>
        <h1 className=' text-3xl font-bold mt-2  '>
            Saved Blog
        </h1>
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
          {
            filteredBlogs.length > 0 ?(
              filteredBlogs.map((ele,idx)=>(
                <BlogCard key={idx} image={ele.image} title={ele.title} id={ele.id} description={ele.description} created_at={ele.created_at}/>
              ))
            ):(
              <p>No Saved Blogs</p>
            )
          }
        </div>
    </div>
  )
}

export default SavedBlog
