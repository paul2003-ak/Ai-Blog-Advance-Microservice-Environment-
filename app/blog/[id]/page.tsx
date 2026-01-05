"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { author_service, Blog, blog_service, useAppData, User } from "@/context/AppContext";
import axios from "axios";
import { Bookmark, BookmarkCheck, Edit, Trash2Icon, User2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { BlogContext, useBlogData } from "@/context/BlogContext";
import { useSavedBlogsData } from "@/context/SaveBlogContext";

const PartiCularBlogPage = () => {
  const { isAuth, user } = useAppData();
  const { id } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchSingleBlog = async () => {
    try {
      setLoading(true);
      const result = await axios.get<{ blog: Blog; author: User; message: string; }>(`${blog_service}/api/v2/blog/${id}`);

      setBlog(result.data.blog);
      setAuthor(result.data.author);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleBlog();
  }, [id]);

  //add comment section
  const [comment, setComment] = useState("");
  const addComment = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const result = await axios.post<{ message: string }>( `${blog_service}/api/v2/comment/${id}`, { comment }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(result.data.message);
      setComment("");
      fetchAllComments();
    } catch (error) {
      console.log(error);
      toast.error("problem while adding comment");
    } finally {
      setLoading(false);
    }
  };

  //fetch all commnets
  interface commentType {
    id: string;
    comment: string;
    userid: string;
    username: string;
    blogid: number;
    created_at: string;
  }
  const [comments, setComments] = useState<Array<commentType>>([]);
  const fetchAllComments = async () => {
    setLoading(true);
    try {
      const result = await axios.get<{ comments: Array<commentType> }>(`${blog_service}/api/v2/comment/all/${id}`);
      setComments(result.data.comments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllComments();
  }, [id]);


  //Delete Comment
  const HandleCommentdelete = async (commentid:string)=>{
    if(confirm("Are you sure you want to delete this comment?")){
        setLoading(true);
    try{
        const token = Cookies.get("token");

        const result=await axios.delete<{message:string}>(`${blog_service}/api/v2/comment/delete/${commentid}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        toast.success(result.data.message)
        fetchAllComments()
    }catch(error){
        console.log(error);
        toast.error("problem while deleting comment")
    }finally{
        setLoading(false)
    }
    }
    else{
        return
    }
  }


  //Delete Blog
  const{fetchBlogs}=useBlogData()
  const HandleBlogdelete = async ()=>{
    if(confirm("Are you sure you want to delete this comment?")){
        setLoading(true);
    try{
        const token = Cookies.get("token");

        const result=await axios.delete<{message:string}>(`${author_service}/blog/v1/blog/delete/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        toast.success(result.data.message)
       setTimeout(() => {
         fetchBlogs()
       }, 3000);
        router.push("/blogs")
    }catch(error){
        console.log(error);
        toast.error("problem while deleting Blog")
    }finally{
        setLoading(false)
    }
    }
    else{
        return
    }
  }



  //Save Blog Function
  const [saved, setSaved] = useState(false)
  const {savedBlogs , fetchSaveBlogs}=useSavedBlogsData()
  const savedBlog=async()=>{
    try{
      setLoading(true)
      const token=Cookies.get("token")
      const result=await axios.post<{message:string}>(`${blog_service}/api/v2/saveblog/${id}`,{},{
        headers:{
          Authorization:`Bearer ${token}`,
        }
      });
      toast.success(result.data.message)
      if(result.data.message==="Blog saved successfully"){
        setSaved(true)
      }
      else if(result.data.message==="Blog unsaved successfully"){
        setSaved(false)
      }
      fetchSaveBlogs()
    }
    catch(error){
      toast.error("problem while saving blog")
      console.log(error);
    }finally{
      setLoading(false)
    }
    }

    useEffect(()=>{
      if(savedBlogs && savedBlogs.some((b)=>b.blogid===id)){
        setSaved(true)
      }else{
        setSaved(false)
      }
    },[savedBlogs,id])



  if (!blog) {
    return <Loading />;
  }


  return (
    <div className=" max-w-4xl mx-auto p-6 space-y-6 ">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
          <p className="text-gray-600 mt-2 flex items-center">
            <Link
              href={`/profile/${author?._id}`}
              className="flex items-center gap-2"
            >
              <img src={author?.image} className="w-8 h-8 rounded-full" />
              {author?.name}
            </Link>

            {isAuth && (
              <Button disabled={loading} onClick={savedBlog} variant={"ghost"} className="mx-3 " size={"lg"}>
                {saved ? <BookmarkCheck size={20}/> :<Bookmark size={20} />}
              </Button>
            )}
            {blog?.author === user?._id && (
              <>
                <Button
                  onClick={() => router.push(`/blog/editblog/${blog?.id}`)}
                  size={"sm"}
                >
                  <Edit />
                </Button>

                <Button onClick={HandleBlogdelete} size={"sm"} variant={"destructive"} disabled={loading} className="mx-2">
                  <Trash2Icon size={20} />
                </Button>
              </>
            )}
          </p>
        </CardHeader>

        <CardContent>
          <img
            src={blog?.image}
            alt=""
            className=" w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className=" text-lg text-gray-700 mb-4 ">{blog?.description}</p>
          <div
            className=" prose max-w-none "
            dangerouslySetInnerHTML={{ __html: blog?.blogcontent }}
          />
        </CardContent>
      </Card>



      {/* Comment section */}
      {isAuth && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Leave a Comment..</h3>
          </CardHeader>

          <CardContent>
            <Label htmlFor="comment">Your Comment...</Label>
            <Input
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type Your Comment here."
              className="my-2"
            />
            <Button onClick={addComment} disabled={loading}>
              {loading ? "adding comment..." : "Post Comment"}
            </Button>
          </CardContent>
        </Card>
      )}

    {/* See all the comments */}
      <Card>
        <CardHeader>
          <h3 className=" text-lg font-medium  ">All Comments...</h3>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            comments.map((ele, idx) => (
              <div
                key={idx}
                className=" flex items-start gap-3 py-3  border-b last:border-b-0 hover:bg-gray-50 transition-all duration-200 rounded-lg px-2 "
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <span className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm">
                    <User2 className="text-gray-600" />
                  </span>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      {ele?.username}
                    </p>

                    <span className="text-xs text-gray-500">
                      {new Date(ele?.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-700 mt-1 leading-relaxed">
                    {ele?.comment}
                  </p>
                </div>

                {/* Delete Button */}
                {ele.userid === user?._id && (
                  <Button onClick={()=>HandleCommentdelete(ele.id)} disabled={loading}
                    variant="destructive"
                    size="sm"
                    className="shadow-sm hover:scale-105 transition-all"
                  >
                    <Trash2Icon size={18} />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              No comments found...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartiCularBlogPage;
