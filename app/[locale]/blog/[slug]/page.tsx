import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "Top 10 Training Tips for Cape Town Marathon",
    slug: "top-10-training-tips",
    excerpt: "Expert advice from elite coaches on preparing for Africa's major marathon.",
    content: "Full article content here...",
    category: "Training",
    image: "/images/blog-training.jpg",
    createdAt: new Date("2027-01-15"),
  },
  {
    id: "2",
    title: "Cape Town Weather: What to Expect on Race Day",
    slug: "cape-town-weather-race-day",
    excerpt: "Understanding Cape Town's unique climate for optimal race preparation.",
    content: "Full article content here...",
    category: "Race Day",
    image: "/images/blog-weather.jpg",
    createdAt: new Date("2027-02-01"),
  },
  {
    id: "3",
    title: "The Ultimate Safari Guide for Runners",
    slug: "safari-guide-for-runners",
    excerpt: "Combine your marathon trip with an unforgettable wildlife experience.",
    content: "Full article content here...",
    category: "Travel",
    image: "/images/blog-safari.jpg",
    createdAt: new Date("2027-02-20"),
  },
  {
    id: "4",
    title: "Nutrition Strategy for Marathon Success",
    slug: "nutrition-strategy-marathon",
    excerpt: "What to eat before, during, and after the big race.",
    content: "Full article content here...",
    category: "Nutrition",
    image: "/images/blog-nutrition.jpg",
    createdAt: new Date("2027-03-05"),
  },
  {
    id: "5",
    title: "Cape Town's Best Running Routes",
    slug: "best-running-routes-cape-town",
    excerpt: "Explore the most scenic trails and roads for your training runs.",
    content: "Full article content here...",
    category: "Training",
    image: "/images/blog-routes.jpg",
    createdAt: new Date("2027-03-15"),
  },
  {
    id: "6",
    title: "Gear Guide: What to Pack for Cape Town",
    slug: "gear-guide-cape-town",
    excerpt: "Essential gear recommendations for running in Cape Town's conditions.",
    content: "Full article content here...",
    category: "Gear",
    image: "/images/blog-gear.jpg",
    createdAt: new Date("2027-04-01"),
  },
];

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;  // ← await обязателен!
    const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="pt-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-teal-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-full mb-4">
          {post.category}
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold mb-6">{post.title}</h1>

        <div className="flex items-center gap-6 text-sm text-neutral-400 mb-8 pb-8 border-b border-white/10">
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Cape Town Marathon Team
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {post.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            5 min read
          </span>
        </div>

        <div className="aspect-[16/9] bg-neutral-800 rounded-2xl mb-8 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${post.image || "/images/blog-default.jpg"}')` }}
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-neutral-300 leading-relaxed mb-8">{post.excerpt}</p>
          <div className="text-neutral-300 leading-relaxed space-y-4">
            <p>{post.content}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
              deserunt mollit anim id est laborum.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Takeaways</h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-400">
              <li>Prepare for variable weather conditions on race day</li>
              <li>Train on similar terrain to build confidence</li>
              <li>Focus on nutrition strategy in the final weeks</li>
              <li>Arrive early to acclimatize to the altitude</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
