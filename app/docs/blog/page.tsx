import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    title: "The Science of Composting: Turning Waste into Soil Gold",
    excerpt: "Learn about the biological processes that transform food waste into nutrient-rich compost, and how EcoShare optimizes this natural cycle.",
    author: "Dr. Maria Santos",
    date: "October 8, 2025",
    category: "Education",
    readTime: "5 min read",
    featured: true,
  },
  {
    title: "Success Story: How Maria Reduced Her Restaurant's Waste by 70%",
    excerpt: "Maria's Kitchen in Cebu City shares their journey to zero waste using EcoShare, including tips for other food businesses.",
    author: "EcoShare Team",
    date: "October 5, 2025",
    category: "Case Study",
    readTime: "4 min read",
    featured: false,
  },
  {
    title: "Seasonal Composting: What to Share in the Rainy Season",
    excerpt: "A guide to the best compostable materials available during Philippines' wet season and how they benefit different crops.",
    author: "Carlos Reyes",
    date: "October 1, 2025",
    category: "Tips & Tricks",
    readTime: "3 min read",
    featured: false,
  },
  {
    title: "Building Community: The Social Impact of EcoShare",
    excerpt: "How our platform is fostering connections between urban food generators and rural farmers across the Philippines.",
    author: "Ana Cruz",
    date: "September 25, 2025",
    category: "Community",
    readTime: "6 min read",
    featured: false,
  },
  {
    title: "Compost Quality: Understanding NPK Ratios and Plant Nutrition",
    excerpt: "A beginner-friendly guide to understanding compost quality metrics and how they affect plant growth.",
    author: "Dr. Jose Martinez",
    date: "September 20, 2025",
    category: "Education",
    readTime: "7 min read",
    featured: false,
  },
  {
    title: "EcoShare's Journey: From Concept to 10,000 Users",
    excerpt: "Celebrating our milestones and sharing the challenges and victories along the way.",
    author: "EcoShare Team",
    date: "September 15, 2025",
    category: "Company",
    readTime: "8 min read",
    featured: false,
  },
];

const categories = [
  "All Posts",
  "Education",
  "Tips & Tricks",
  "Case Study",
  "Community",
  "Company"
];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Blog
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">EcoShare Blog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Insights, stories, and educational content about sustainable food waste management,
          composting, and community-driven environmental solutions.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={category === "All Posts" ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Badge>Featured</Badge>
              <Badge variant="outline">{featuredPost.category}</Badge>
            </div>
            <h2 className="text-2xl font-bold mb-3">{featuredPost.title}</h2>
            <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{featuredPost.author}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{featuredPost.date}</span>
                </span>
                <span>{featuredPost.readTime}</span>
              </div>
              <Button>
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regular Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {regularPosts.map((post, index) => (
          <Card key={index} className="h-fit hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{post.author}</span>
                </div>
                <span>{post.date}</span>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3">
                Read Article
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold">Stay Informed</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest articles, composting tips,
              and EcoShare updates delivered to your inbox.
            </p>
            <div className="flex justify-center space-x-4">
              <Button>Subscribe to Newsletter</Button>
              <Badge variant="outline" className="cursor-pointer">
                View All Posts →
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Topics</CardTitle>
          <CardDescription>
            Most read articles and trending topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Trending Now</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary hover:underline">Zero Waste Restaurant Guide</a></li>
                <li><a href="#" className="text-primary hover:underline">Urban Composting Solutions</a></li>
                <li><a href="#" className="text-primary hover:underline">Seasonal Gardening Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Most Read</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary hover:underline">Composting 101</a></li>
                <li><a href="#" className="text-primary hover:underline">Farmer Success Stories</a></li>
                <li><a href="#" className="text-primary hover:underline">Platform Updates</a></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
