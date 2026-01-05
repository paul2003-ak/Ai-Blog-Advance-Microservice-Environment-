"use client";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData, user_service } from "@/context/AppContext";
import { AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {  useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
}

const Profilepage = () => {
    const { user, setUser,logout } = useAppData();
    const [loading, setLoading] = useState(false);
    
//update profile part
    const InputRef = useRef<HTMLInputElement>(null);
    

    const ClickHandler = ()=>{
        console.log("Working..")
        InputRef.current?.click();
    };

  const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formdata = new FormData();

      formdata.append("file", file);
      try {
        setLoading(true);
        const token = Cookies.get("token");

        
        const result = await axios.post<{user: User;message: string;token: "string";}>(`${user_service}/api/v1/updateprofile`,
            formdata, {
            headers: {//send the token with the formdata and will get a new token...
            Authorization: `Bearer ${token}`,
          },
        });
        
        toast.success(result?.data?.message);
        
        Cookies.set("token", result?.data?.token, {//set the new token
          expires: 5,
          secure: true,
          path: "/",
        });

        setLoading(false);
        setUser(result?.data?.user);

      } catch (error) {
        console.log(error)
        toast.error("Image Upload Failed");
        setLoading(false);
      }
    }
  };

  // dialog part (Mean User Update Part)
  const [open, setOpen] = useState(false);
  const router=useRouter();

 const [formdata, setFormdata] = useState({
  name: "",
  bio: "",
  instagram: "",
  facebook: "",
  linkedin: "",
});

useEffect(() => {
  if (user) {
    const id = setTimeout(() => {
      setFormdata({
        name: user.name || "",
        bio: user.bio || "",
        instagram: user.instagram || "",
        facebook: user.facebook || "",
        linkedin: user.linkedin || "",
      });
    }, 0);
    return () => clearTimeout(id);
  }
}, [user]);

  const handleFormSubmit=async()=>{
    try {
        setLoading(true);
        const token=Cookies.get("token");
        const result=await axios.post<{message:string; user:User ; token:string}>(`${user_service}/api/v1/update`,formdata,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
        toast.success(result?.data?.message);
        setUser(result?.data?.user);
        Cookies.set("token",result?.data?.token,{
            expires:5,
            secure:true,
            path:"/",
        })
        setLoading(false);
        setOpen(false);
    } catch (error) {
        console.log(error);
        toast.error("Profile Update Failed");
        setLoading(false);
    }
  }


  //Logout Part

    const LogoutHandler=async()=>{
        await logout();
        return router.push("/login");
    }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {
        loading ? <Loading/>
        :
        <Card className=" w-full max-w-xl shadow-lg border rounded-2xl p-6 ">
        <CardHeader className=" text-center ">
          <CardTitle className="text-2xl font-semibold">Profile</CardTitle>

          <CardContent className="flex flex-col items-center space-y-4 ">
            <Avatar onClick={ClickHandler} className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer">
              <AvatarImage src={user?.image} alt="profile pic" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={InputRef}
                onChange={changeHandler}
              />
            </Avatar>

            <div className="w-full space-y-2 text-center">
                <label className=" font-medium ">Name</label>
                <p>{user?.name}</p>
            </div>
            {
                user?.bio && (<div className="w-full space-y-2 text-center">
                <label className=" font-medium ">Bio</label>
                <p>{user?.bio}</p>
            </div>
            )}

            <div className="flex gap-4 mt-3">
            {
                user?.instagram && (<a href={user.instagram} target="_blank" rel="noopener noreferrer" >
                <Instagram className="text-pink-500 text-2xl"/>
              </a>)
            }
            {
                user?.facebook && (<a href={user.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="text-blue-500 text-2xl"/>
              </a>)
            }
            {
                user?.linkedin && (<a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="text-blue-700 text-2xl"/>
              </a>)
            }
            </div>


            <div className=" flex flex-col gap-2 sm:flex-row mt-6 w-full justify-center">
                <Button onClick={LogoutHandler}>Logout</Button>
                <Button onClick={() => router.push("/blog/new")}>Add Blog</Button>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant={"outline"}>Edit Profile</Button>
                    </DialogTrigger>

                    <DialogContent className=" sm:max-w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        <DialogHeader>
                            <DialogTitle>
                                Edit Profile
                            </DialogTitle>
                        </DialogHeader>
                        <div className=" space-y-3 ">
                            <div>
                                <Label>Name</Label>
                                <Input value={formdata?.name} onChange={(e)=>setFormdata({...formdata,name:e.target.value})}/>
                            </div>
                            <div>
                                <Label>Bio</Label>
                                <Input value={formdata?.bio} onChange={(e)=>setFormdata({...formdata,bio:e.target.value})}/>
                            </div>
                            <div>
                                <Label>Instagram</Label>
                                <Input value={formdata?.instagram} onChange={(e)=>setFormdata({...formdata,instagram:e.target.value})}/>
                            </div>
                            <div>
                                <Label>Facebook</Label>
                                <Input value={formdata?.facebook} onChange={(e)=>setFormdata({...formdata,facebook:e.target.value})}/>
                            </div>
                            <div>
                                <Label>LinkedIn</Label>
                                <Input value={formdata?.linkedin} onChange={(e)=>setFormdata({...formdata,linkedin:e.target.value})}/>
                            </div>

                            <Button onClick={handleFormSubmit} className="w-full mt-4 ">Save Chnages</Button>
                        </div>
                    </DialogContent>

                </Dialog>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
      }
    </div>
  );
};

export default Profilepage;
