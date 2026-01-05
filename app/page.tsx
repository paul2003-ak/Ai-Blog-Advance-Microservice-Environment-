"use client"
import { useAppData } from '@/context/AppContext';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

const Home = () => {
  const { isAuth } = useAppData();

  const handleclick = () => {
    if (!isAuth) {
      toast.error("Plz Login First");
      return redirect("/login");
    } else {
      return redirect("/blog/new");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navigation - Clean & Sticky */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-lg">B</span>
            <span>Blog<span className="text-indigo-600">CORE</span></span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Added a subtle link for non-logged in users to browse */}
             <Link href="/blogs" className="hidden md:block text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
               Read
             </Link>
             <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
            
            {isAuth ? (
              <Link
                href={"/profile"}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2 rounded-full font-medium transition-all text-sm"
              >
                <span>👤</span> Profile
              </Link>
            ) : (
              <Link
                href={"/login"}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-all text-sm shadow-md shadow-indigo-200"
              >
                Plz Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Editorial Style */}
      <header className="relative py-24 px-6 text-center max-w-5xl mx-auto">
        {/* Decorative background blob */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-100/50 blur-[100px] -z-10 rounded-full"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 tracking-tight leading-[1.1]">
          Share your <span className="text-indigo-600 decoration-4 underline decoration-indigo-200 underline-offset-4">Everything</span> with us.
        </h1>
        <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
          A community of writers, developers, and thinkers. Read what people are talking about right now.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleclick} 
            className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black hover:-translate-y-1 transition-all shadow-xl shadow-gray-200"
          >
            Start Writing
          </button>
          <Link
            href="/blogs"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Read Blogs <span>→</span>
          </Link>
        </div>
      </header>

      {/* EXTRA: Trending Topics / Categories Pill List */}
      <section className="max-w-7xl mx-auto px-6 mb-16 overflow-x-auto">
        <div className="flex gap-3 pb-4 justify-start md:justify-center min-w-max">
            <TopicPill text="🔥 Trending" active />
            <TopicPill text="Technology" />
            <TopicPill text="Lifestyle" />
            <TopicPill text="Coding" />
            <TopicPill text="Design" />
            <TopicPill text="Productivity" />
            <TopicPill text="AI & Future" />
        </div>
      </section>

      {/* EXTRA: "Mock" Blog Grid to show what the site is about */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Trending on BlogCORE</h2>
            <Link href="/blogs" className="text-indigo-600 font-semibold hover:underline text-sm">View all posts</Link>
        </div>

        {/* I added these 'Dummy' cards so the landing page looks populated like a real blog */}
        <div className="grid md:grid-cols-3 gap-8">
            <MockBlogCard 
                category="Development"
                title="Why Next.js is the future of React"
                author="Ayan Paul"
                date="2 days ago"
                readTime="5 min read"
                color="bg-blue-100 text-blue-700"
            />
            <MockBlogCard 
                category="Lifestyle"
                title="The art of waking up early"
                author="Sarah J."
                date="4 hours ago"
                readTime="3 min read"
                color="bg-green-100 text-green-700"
            />
            <MockBlogCard 
                category="Design"
                title="Minimalism in modern UI design"
                author="David K."
                date="1 day ago"
                readTime="7 min read"
                color="bg-purple-100 text-purple-700"
            />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-900 font-bold text-xl">BlogCORE</div>
            <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} BlogCORE. Crafted for storytellers.
            </div>
            <div className="flex gap-6 text-gray-500">
                <a href="#" className="hover:text-indigo-600 transition">Twitter</a>
                <a href="#" className="hover:text-indigo-600 transition">GitHub</a>
                <a href="#" className="hover:text-indigo-600 transition">LinkedIn</a>
            </div>
        </div>
      </footer>

    </div>
  );
};

// --- Small UI Components for the "Blog Look" ---

// 1. A Topic Pill component
function TopicPill({ text, active = false }: { text: string, active?: boolean }) {
    return (
        <button className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            active 
            ? "bg-black text-white shadow-lg" 
            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
        }`}>
            {text}
        </button>
    )
}

// 2. A Mock Blog Card to make it look populated
type MockBlogCardProps = {
    category: string;
    title: string;
    author: string;
    date: string;
    readTime: string;
    color?: string;
};

function MockBlogCard({ category, title, author, date, readTime, color = "bg-gray-100 text-gray-700" }: MockBlogCardProps) {
    return (
        <article className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>
                    {category}
                </span>
                <span className="text-gray-400 text-xs">{readTime}</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {title}
            </h3>
            
            <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {author[0]}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-900">{author}</span>
                    <span className="text-[10px] text-gray-400">{date}</span>
                </div>
            </div>
        </article>
    )
}

export default Home;