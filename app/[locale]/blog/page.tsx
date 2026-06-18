import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = t.raw("posts") as BlogPost[];
  const featured = posts[0];
  const rest = posts.slice(1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="pt-20">
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">
              {t("badge")}
            </span>
            <h1 className="text-5xl font-bold mt-4 mb-6">{t("title")}</h1>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-teal-500/30 transition-colors">
                <div className="aspect-[16/10] lg:aspect-auto bg-neutral-800 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${featured.image || "/images/blog-default.jpg"}')` }}
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="inline-block w-fit px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-full mb-4">
                    {featured.category}
                  </span>
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-teal-400 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-neutral-400 mb-6 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featured.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {t("readTime")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Post Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <div key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-teal-500/30 transition-colors">
                    <div className="aspect-[16/10] bg-neutral-800 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url('${post.image || "/images/blog-default.jpg"}')` }}
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-teal-400 text-xs font-semibold">{post.category}</span>
                      <h3 className="font-bold text-lg mt-2 mb-3 group-hover:text-teal-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-2 text-sm text-teal-400">
                        {t("readMore")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
