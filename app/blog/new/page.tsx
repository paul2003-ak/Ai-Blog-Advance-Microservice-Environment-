"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { RefreshCw } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";

import dynamic from "next/dynamic";
import axios from "axios";
import { author_service } from "@/context/AppContext";
import toast from "react-hot-toast";
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

const Addblog = () => {
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

  const {fetchBlogs}=useBlogData();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        `${author_service}/blog/v1/blog/new`,
        formDatatoSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(result.data.message);
      setLaoding(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: "",
      });

      setTimeout(()=>{
          fetchBlogs();
      },4000)//it is for bcz Create hoyar 4 sec pore abr sob call hoi jano ar updated jinis ta dekhai jano 
                  
    } catch (error) {
      toast.error("Blog creation failed");
      setLaoding(false);
      console.log(error);
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


  //Ai Part
  const [aititle, setAititle] = useState(false);
  //Ai Title
  const AiTitleResponse = async () => {
    let result;
    try {
      setAititle(true);
      console.log(formData.title);
      result = await axios.post<string>(`${author_service}/blog/v1/Ai/title`, {
          text: formData?.title,
        }
      );
      setFormData({ ...formData, title: result.data });
    } catch (error) {
      toast.error("AI title generation failed");
      console.log(error);
    } finally {
      setAititle(false);
    }
  };

  //Ai description
  const [aidescription, setAidescription] = useState(false);
  const AiDescriptionResponse = async () => {
    let result;
    try {
      setAidescription(true);
      console.log(formData.description);
      result = await axios.post<string>(`${author_service}/blog/v1/Ai/description`, {
        title: formData?.title,
        description: formData?.description,
        }
      );
      setFormData({ ...formData, description: result.data });
    } catch (error) {
      toast.error("AI title generation failed");
      console.log(error);
    } finally {
      setAidescription(false);
    }
  };

  //Ai content 
  const [aicontentloading, setAicontentloading] = useState(false)
   const AiContentResponse = async () => {
    let result;
    try {
      setAicontentloading(true);
      console.log(formData.description);
      result = await axios.post<{html:string}>(`${author_service}/blog/v1/Ai/content`, {
        blog:formData?.blogcontent
        }
      );
      setContent(result.data.html);
      setFormData({ ...formData, blogcontent: result.data.html });
    } catch (error) {
      toast.error("AI content generation failed");
      console.log(error);
    } finally {
      setAicontentloading(false);
    }
  };
  


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
                value={formData.title} onChange={(e) =>setFormData({ ...formData, title: e.target.value })}
                className={
                  aititle ? "animate-pulse placeholder:opacity-60" : ""
                }
                required
                placeholder="Enter Blog Title"
              />
              {formData.title==="" ? "" : <Button type="button" onClick={AiTitleResponse} disabled={aititle}>
                  <RefreshCw className={aititle ? "animate-spin " : ""} /> 
                </Button>
                }
            </div>


            {/* Description */}
            <Label>Description</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="description"
                value={formData.description} onChange={(e) =>setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Enter Blog Description"
                className={
                  aidescription ? "animate-pulse placeholder:opacity-60" : ""
                }
              />
              {formData.title==="" ? "" :<Button type="button" onClick={AiDescriptionResponse} disabled={aidescription}>
                <RefreshCw className={aidescription ? "animate-spin " : ""} /> 
              </Button>}
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
                <Button type="button" size={"sm"} onClick={AiContentResponse} disabled={aicontentloading}>
                  <RefreshCw className={aicontentloading ? "animate-spin" : ""} />
                  <span className="ml-2">Fix Grammer</span>
                </Button>
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
  );
};

export default Addblog;
