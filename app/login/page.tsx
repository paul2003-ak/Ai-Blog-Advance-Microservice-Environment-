"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAppData, user_service } from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";

const Loginpage = () => {
  const { user,setUser, loading, setLoading, isAuth, setIsAuth } = useAppData();

  interface GoogleAuthResult {
    code: string;
    // extend with other fields from the provider if needed
  }
  interface Users{
    _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
  }

  const responseGoogle = async (authResult: GoogleAuthResult) => {
    setLoading(true);
    try {
      const result = await axios.post<{ token: string; message: string; user:Users }>(
        `${user_service}/api/v1/login`,
        {
          code: authResult.code,
        }
      );

      Cookies.set("token", result?.data?.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
      toast.success(result?.data?.message);
      setIsAuth(true);
      setLoading(false);
      setUser(result?.data?.user)
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    flow: "auth-code",
  });

  if (isAuth) {
    return redirect("/"); //if user is authenticated then redirect to home page
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-87.5 m-auto mt-60">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-2">
              <Button
                onClick={googleLogin}
                variant="outline"
                className="w-full bg-black text-white"
              >
                Login with Google{" "}
                <Image
                  src="/google.webp"
                  width={32}
                  height={32}
                  alt="google icon"
                  className="w-8 h-8"
                />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Loginpage;
