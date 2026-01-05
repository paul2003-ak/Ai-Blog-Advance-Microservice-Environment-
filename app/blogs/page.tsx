"use client";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import Loading from "@/components/loading";
import React from "react";
import { useAppData } from "@/context/AppContext";
import { useSidebar } from "@/components/ui/sidebar";
import { useBlogData } from "@/context/BlogContext";
import BlogCard from "@/components/BlogCard";

const Blogs = () => {
  const { loading } = useAppData();
  const { blogloading, blogs } = useBlogData();

  const { toggleSidebar } = useSidebar();

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className=" container mx-auto px-4  ">
          <div className=" flex justify-between items-center my-5">
            <h1 className="text-3xl font-bold">Latest Blogs</h1>
            <Button
              onClick={toggleSidebar}
              className="flex item-center gap-2 px-4 bg-primary text-white"
            >
              <Filter size={18} />
              <span>Filter Blogs</span>
            </Button>
          </div>
          {
            blogloading ? <Loading/> :
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
                {
                  blogs?.length===0 && <p>No Blogs yet</p> 
                }
                {
                  blogs && blogs.map((ele,idx)=>(
                    <BlogCard key={idx} image={ele.image} title={ele.title} id={ele.id} description={ele.description} created_at={ele.created_at}/>
                  ))
                }
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default Blogs;