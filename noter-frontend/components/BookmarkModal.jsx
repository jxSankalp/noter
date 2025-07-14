"use client"

import { useState, useEffect } from "react";
import { X, Save, Link, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function BookmarkModal({ isOpen, onClose, onSave, bookmark }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title);
      setDescription(bookmark.description || "");
      setTags(bookmark.tags);
    } else {
      setUrl("");
      setTitle("");
      setDescription("");
      setTags([]);
    }
    setTagInput("");
  }, [bookmark, isOpen]);

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    if (!url.trim()) return;

    onSave({
      url: url.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      tags,
    });

    // Reset form
    setUrl("");
    setTitle("");
    setDescription("");
    setTags([]);
    setTagInput("");
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-card-foreground">
            {bookmark ? "Edit Bookmark" : "Add New Bookmark"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="url"
              className="text-sm font-medium text-card-foreground"
            >
              URL
            </Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com"
                className="pl-10 bg-background border-border"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-card-foreground"
            >
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isLoadingMetadata
                  ? "Loading title..."
                  : "Enter bookmark title..."
              }
              className="bg-background border-border"
              disabled={isLoadingMetadata}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-card-foreground"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isLoadingMetadata
                  ? "Loading description..."
                  : "Enter bookmark description..."
              }
              className="min-h-20 resize-none bg-background border-border"
              disabled={isLoadingMetadata}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-card-foreground">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Add a tag..."
                className="bg-background border-border"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="border-border"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 h-auto p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {isLoadingMetadata && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4 animate-spin" />
              Fetching page information...
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="border-border">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!url?.trim()}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            {bookmark ? "Update Bookmark" : "Create Bookmark"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );};
