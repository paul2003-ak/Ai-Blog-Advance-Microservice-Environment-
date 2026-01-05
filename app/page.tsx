"use client"
import { useAppData } from '@/context/AppContext';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

const Home = () => {
  const {isAuth}=useAppData()
  
  const handleclick = () => {
    if(!isAuth){
      toast.error("Plz Login First")
    }
    return redirect("/blog/new");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-blue-600">
          Blog<span className="text-gray-900">CORE</span>
        </div>
        {isAuth ? (
                <Link
                  href={"/profile"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href={"/login"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all"
                >
                  Plz Login
                </Link>
              )}
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Share your Everything with us
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Explore our latest insights, tutorials, and industry updates.
          Everything you need to build faster, smarter, and better.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={handleclick} className="bg-black text-white px-8 py-3 rounded-lg font-semibold">
            Create Blog
          </button>
          <Link
            href="/blogs"
            className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Visit the Blogs
          </Link>
        </div>
      </header>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <FeatureCard
          title="Performance"
          desc="Lightning fast load times with Next.js App Router."
        />
        <FeatureCard
          title="Insights"
          desc="Deep dives into React, CSS, and modern architecture."
        />
        <FeatureCard
          title="Community"
          desc="Join thousands of developers sharing knowledge."
        />
      </section>
    </div>
  );
};

// Small reusable component for features
function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  );
}

export default Home;
