import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Instagram, Facebook, Linkedin, Twitter, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentPost {
  id: string;
  title: string;
  platform: "instagram" | "facebook" | "linkedin" | "twitter";
  date: string;
  time: string;
  status: "scheduled" | "draft" | "published";
  type: "listing" | "market-update" | "tips" | "personal" | "testimonial";
}

const platformIcons = {
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
};

const platformColors = {
  instagram: "bg-pink-500/20 text-pink-400",
  facebook: "bg-blue-500/20 text-blue-400",
  linkedin: "bg-sky-500/20 text-sky-400",
  twitter: "bg-gray-500/20 text-gray-400",
};

const typeColors = {
  "listing": "bg-purple-500/20 text-purple-400",
  "market-update": "bg-teal-500/20 text-teal-400",
  "tips": "bg-amber-500/20 text-amber-400",
  "personal": "bg-green-500/20 text-green-400",
  "testimonial": "bg-blue-500/20 text-blue-400",
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const mockPosts: ContentPost[] = [
  { id: "1", title: "New Listing: 123 Oak Street", platform: "instagram", date: "Mon", time: "9:00 AM", status: "scheduled", type: "listing" },
  { id: "2", title: "Market Update Q1 2024", platform: "linkedin", date: "Tue", time: "11:00 AM", status: "scheduled", type: "market-update" },
  { id: "3", title: "5 Tips for First-Time Buyers", platform: "facebook", date: "Wed", time: "2:00 PM", status: "draft", type: "tips" },
  { id: "4", title: "Behind the scenes at open house", platform: "instagram", date: "Thu", time: "4:00 PM", status: "scheduled", type: "personal" },
  { id: "5", title: "Client Success Story - The Johnsons", platform: "facebook", date: "Fri", time: "10:00 AM", status: "scheduled", type: "testimonial" },
  { id: "6", title: "Weekend Open House Announcement", platform: "instagram", date: "Sat", time: "8:00 AM", status: "scheduled", type: "listing" },
];

export function ContentCalendar() {
  const [currentWeek] = useState("Jan 8 - 14, 2024");

  const getPostsForDay = (day: string) => mockPosts.filter(p => p.date === day);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Content Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{currentWeek}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="sm" className="gap-2 ml-2">
              <Plus className="w-4 h-4" />
              Add Post
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="min-h-[200px]">
              <div className="text-center pb-2 border-b border-border mb-2">
                <span className="text-sm font-medium">{day}</span>
              </div>
              <div className="space-y-2">
                {getPostsForDay(day).map((post) => (
                  <div
                    key={post.id}
                    className="p-2 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div className={cn("p-1 rounded", platformColors[post.platform])}>
                        {platformIcons[post.platform]}
                      </div>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                    <p className="text-xs font-medium line-clamp-2">{post.title}</p>
                    <Badge className={cn("text-[10px] mt-1 px-1 py-0", typeColors[post.type])}>
                      {post.type.replace("-", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
