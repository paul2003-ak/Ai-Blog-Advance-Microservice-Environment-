"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

//what the work of use client ?
// use client is a directive in Next.js that indicates that the following code should be executed on the client side (browser) rather than on the server side. This is important for components that rely on client-side features like state management, event handling, or accessing browser APIs.

export const user_service = "https://user-service-8xkw.onrender.com";
export const author_service = "https://author-service-bprj.onrender.com";
export const blog_service = "https://blog-service-lavb.onrender.com";

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  blogcontent: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}

interface AppContextValue {
  // Define the shape of your context value here
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;//bcz this is a state function
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  isAuth: boolean;
  logout:()=>Promise<void>;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const Appprovider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const result = await axios.get<{curruser:User}>(`${user_service}/api/v1/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(result?.data?.curruser);
        setIsAuth(true);
        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchuser();
  }, []);

  //logout function
  const logout=async()=>{
    try {
      Cookies.remove("token");
      setUser(null);
      setIsAuth(false);
      toast.success("Logout Successful");
    } catch (error) {
      console.log("Logout error", error);
      
    }
  }

  return (
    <AppContext.Provider value={{ user,setUser, loading, setLoading, isAuth, setIsAuth,logout }}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        {children}
        <Toaster />
      </GoogleOAuthProvider>
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within a AppProvider");
  }
  return context;
};
//why use useAppData?
// Without this hook, every component would do:
// const { user } = useContext(AppContext);***
// Problems:
// 	•	No safety check ❌
// 	•	Repeated code ❌
// 	•	Harder to refactor ❌

//     With useAppData:
//     const { user } = useAppData();****
//     ✔ Clean
// ✔ Consistent
// ✔ Readable
