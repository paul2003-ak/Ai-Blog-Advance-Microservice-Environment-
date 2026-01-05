"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { CircleUserRound, LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/AppContext";

const Navbar = () => {
  const [isopen, setIsopen] = useState(false);
  const { loading, isAuth } = useAppData();
  return (
    <nav className="bg-white shadow-md p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"} className="text-2xl font-bold text-gray-900">
          The Reading Retreat
        </Link>

        <div className="md:hidden">
          <Button variant={"ghost"} onClick={() => setIsopen(!isopen)}>
            {isopen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        <ul className="hidden md:flex justify-center items-center space-x-6 text-gray-700">
          <li>
            <Link href={"/"} className="hover:text-gray-900 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href={"/blogs"} className="hover:text-gray-900 transition">
              Blogs
            </Link>
          </li>
          <li>
            {
              isAuth && <Link
              href={"/savedblog"}
              className="hover:text-gray-900 transition"
            >
              Saved Blogs
            </Link>
            }
          </li>
          {loading ? ("") : (
            <li>
              {isAuth ? (
                <Link
                  href={"/profile"}
                  className="hover:text-gray-900 transition"
                >
                  <CircleUserRound />
                </Link>
              ) : (
                <Link
                  href={"/login"}
                  className="hover:text-gray-900 transition"
                >
                  <LogIn />
                </Link>
              )}
            </li>
          )}
        </ul>
      </div>


        {/* for small page */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isopen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col items-center justify-center gap-5 space-x-6 text-gray-700">
          <li>
            <Link href={"/"} className="hover:text-gray-900 transition">
              Home
            </Link>
          </li>
          <li>
            {
              isAuth && <Link
              href={"/savedblog"}
              className="hover:text-gray-900 transition"
            >
              Saved Blogs
            </Link>
            }
          </li>
          <li>
            {loading ? ("") : (
            <li>
              {isAuth ? (
                <Link
                  href={"/profile"}
                  className="hover:text-gray-900 transition"
                >
                  <CircleUserRound />
                </Link>
              ) : (
                <Link
                  href={"/login"}
                  className="hover:text-gray-900 transition"
                >
                  <LogIn />
                </Link>
              )}
            </li>
          )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
