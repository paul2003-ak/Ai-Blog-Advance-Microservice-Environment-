import Link from "next/link";
import React from "react";
import { Card } from "./ui/card";
import { Calendar } from "lucide-react";
import moment from "moment";//give the current time and date (npm i moment)

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  created_at: string;
}

const BlogCard:React.FC<BlogCardProps> = ({image,title,id,description,created_at}) => {
  return (
    <Link href={`/blog/${id}`}>
  <Card className="overflow-hidden rounded-2xl border border-gray-200bg-whiteshadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    
    <div className="w-full h-[220px] overflow-hidden">
      <img src={image} alt={title} className=" w-full  h-full  object-cover  transition-transform  duration-300   hover:scale-110 " />
    </div>

    <div className="p-4 space-y-2">
      <p className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Calendar size={16} />
        <span>{moment(created_at).format("DD-MM-YYYY")}</span>
      </p>

      <h2 className="text-lg font-semibold text-gray-900 text-center line-clamp-1">
        {title}
      </h2>

      <p className="text-gray-600 text-sm text-center line-clamp-2">
        {description.slice(0, 60)}...
      </p>
    </div>
  </Card>
</Link>
  )
};

export default BlogCard;


