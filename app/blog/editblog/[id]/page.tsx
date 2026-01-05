"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useMemo, useRef, useState } from "react";

import Cookies from "js-cookie";

import dynamic from "next/dynamic";
import axios from "axios";
import { author_service, Blog, blog_service } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useBlogData } from "@/context/BlogContext";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });


const blogCategories = [
  "Technology",
  "Health",
  "Finance",
  "Travel",
  "Education",
  "Entertainment",
  "study",
];
interface BlogData {
  title: string;
  description: string;
  category: string;
  image: File | null;
  blogcontent: string;
  author: string;
}

const EditBlog = () => {
    const InputRef = useRef<HTMLInputElement>(null);

  const clickHandler = () => {
    console.log("Working..");
    InputRef.current?.click();
  };

  const [laoding, setLaoding] = useState(false);

  type FormDataType = {
    title: string;
    description: string;
    category: string;
    image: File | null;
    blogcontent: string;
  };
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  const handlefileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  

   //JoditEditor config
    const editor = useRef(null);
    const [content, setContent] = useState("");
  
    const config = useMemo(
      () => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: "Start typing...",
      }),
      []
    );


     //fetch the data first
        const {fetchBlogs} = useBlogData();
      const {id}=useParams();
      const [existingImage, setExistingImage] = useState<string | null>(null)
      useEffect(()=>{
          const fetchBlog=async()=>{
              setLaoding(true)
              try {
                  const result=await axios.get<{blog:Blog}>(`${blog_service}/api/v2/blog/${id}`)
                  const blog=result.data.blog
                  setContent(blog.blogcontent)
                  setFormData({
                      title:blog.title,
                      description:blog.description,
                      category:blog.category,
                      image:null,
                      blogcontent:blog.blogcontent
                  })
                  setExistingImage(blog.image)
              } catch (error) {
                  console.log(error)
              }finally{
                  setLaoding(false)
              }
          }
          if(id)fetchBlog();
      },[id])


      //update the blog
      const router=useRouter();
        const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{

            e.preventDefault();
            setLaoding(true);
            const formDatatoSend = new FormData();

            formDatatoSend.append("title", formData.title);
            formDatatoSend.append("description", formData.description);
            formDatatoSend.append("category", formData.category);
            formDatatoSend.append("blogcontent", content);
            if (formData.image) {
              formDatatoSend.append("file", formData.image);
            }
        try {
              const token = Cookies.get("token");
              const result = await axios.post<{ message: string; data: BlogData }>(
                `${author_service}/blog/v1/blog/update/${id}`,
                formDatatoSend,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              toast.success(result.data.message);
              setLaoding(false);

               fetchBlogs();//it is for bcz update hoyar 4 sec pore abr sob call hoi jano ar updated jinis ta dekhai jano 

              router.push(`/blog/${id}`)

            } catch (error) {
              toast.error("Blog Updation failed");
              setLaoding(false);
              console.log(error);
            }
    }
  

  return (
     <div className="max-w-4xl mx-auto p-6 ">
      <Card>
        <CardHeader>
          <h2 className=" text-2xl font-bold ">Add new Blog</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className=" space-y-4  ">


            {/* Title */}
            <Label>Title</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="title"
                value={formData.title} onChange={(e) =>setFormData({ ...formData, title: e.target.value })}                required
                placeholder="Enter Blog Title"
              />
              
            </div>


            {/* Description */}
            <Label>Description</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="description"
                value={formData.description} onChange={(e) =>setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Enter Blog Description"
              />
              
            </div>


            {/* Category */}
            <Label>Category</Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              required
            >
              <SelectTrigger className=" w-40 cursor-pointer rounded-md border border-gray-400 shadow-sm hover:border-gray-400 ">
                <SelectValue
                  placeholder={
                    formData.category ? formData.category : "Select Category"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {blogCategories?.map((ele, idx) => (
                  <SelectItem key={idx} value={ele}>
                    {ele}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            {/* upload Image */}
            <div className="space-y-4">
              <Label>Image Upload</Label>
              {
                //!formData?.image bcz i set the formData.image:null
                  existingImage && !formData?.image &&(
                    <img src={existingImage} alt="" className="w-40 h-40 object-cover rounded mb-2" />
                  )
              }
              <Button type="button" onClick={clickHandler}>
                    {formData.image ? formData.image.name : "Upload Image"}
                <Input
                  onChange={handlefileChange}
                  ref={InputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </Button>
            </div>


            {/* Blog Content */}
            <div>
              <Label>Blog Content</Label>

              <div className=" flex justify-between item-center mb-2 ">
                <p className="text-sm text-muted-foreground">
                  paste your blog content here. You can use rich text formating
                  . Please add image after improving you grammer.
                </p>
                
              </div>


              {/* Add JODITEDITOR */}
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => {
                  setContent(newContent);
                  setFormData((prev) => ({ ...prev, blogcontent: newContent }));
                }} // preferred to use only this option to update the content for performance reasons
              />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={laoding}>
              {laoding ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditBlog
