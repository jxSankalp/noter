"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Tag,
  ExternalLink,
  Globe,
  Bookmark as BookmarkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkModal } from "@/components/BookmarkModal";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);


  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get("/bookmarks");
        setBookmarks(res.data);
      } catch (err) {
        toast.error("Failed to fetch bookmarks");
        console.error(err);
      }
    };

    fetchBookmarks();
  }, []);

  const handleAddBookmark = () => {
    setSelectedBookmark(null);
    setIsModalOpen(true);
  };

  const handleEditBookmark = (bookmark) => {
    setSelectedBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleDeleteBookmark = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
      toast.success("Bookmark deleted successfully");
    } catch (err) {
      toast.error("Failed to delete bookmark");
      console.error(err);
    }
  };

  const handleSaveBookmark = async (bookmarkData) => {
    try {
      if (selectedBookmark) {
        // ✅ Update
        const res = await api.put(
          `/bookmarks/${selectedBookmark._id}`,
          bookmarkData
        );
        setBookmarks((prev) =>
          prev.map((b) => (b._id === selectedBookmark._id ? res.data : b))
        );
        toast.success("Bookmark updated successfully");
      } else {
        // ✅ Create
        const res = await api.post("/bookmarks", bookmarkData);
        setBookmarks((prev) => [res.data, ...prev]);
        toast.success("Bookmark added successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save bookmark");
      console.error(err);
    }
  };

  // 🔎 Filter logic
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const q = searchQuery.toLowerCase();
    return (
      bookmark.title?.toLowerCase().includes(q) ||
      bookmark.url?.toLowerCase().includes(q) ||
      bookmark.description?.toLowerCase().includes(q) ||
      bookmark.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Bookmarks</h1>
            <p className="text-muted-foreground mt-1">
              {filteredBookmarks.length}{" "}
              {filteredBookmarks.length === 1 ? "bookmark" : "bookmarks"}
            </p>
          </div>
          <Button
            onClick={handleAddBookmark}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bookmark
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks by title, URL, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark) => (
            <Card
              key={bookmark._id}
              className="group hover:shadow-hover transition-all duration-200 border-border bg-card animate-fade-in"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      {bookmark.favicon ? (
                        <img
                          src={bookmark.favicon}
                          alt=""
                          className="w-5 h-5 rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}
                      <Globe
                        className={`h-5 w-5 text-muted-foreground ${
                          bookmark.favicon ? "hidden" : ""
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-2 leading-tight">
                        {bookmark.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mt-1">
                        {getDomain(bookmark.url)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(bookmark.url, "_blank")}
                      className="h-8 w-8 p-0 hover:bg-accent"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBookmark(bookmark)}
                      className="h-8 w-8 p-0 hover:bg-accent"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBookmark(bookmark._id)}
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {bookmark.description && (
                  <p className="text-sm text-card-foreground mb-4 line-clamp-2">
                    {bookmark.description}
                  </p>
                )}
                {bookmark.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {bookmark.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-secondary text-secondary-foreground"
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookmarks.length === 0 && (
          <div className="text-center py-12">
            <BookmarkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? "No bookmarks found" : "No bookmarks yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Save your first bookmark to get started"}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleAddBookmark}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bookmark
              </Button>
            )}
          </div>
        )}
      </div>

      <BookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBookmark}
        bookmark={selectedBookmark}
      />
    </div>
  );
}
