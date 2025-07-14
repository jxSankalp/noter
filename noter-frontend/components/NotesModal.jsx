"use client"

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function NoteModal({ isOpen, onClose, onSave, note }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
    }
    setTagInput("");
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      tags,
    });

    // Reset form
    setTitle("");
    setContent("");
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
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
            {note ? "Edit Note" : "Add New Note"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
              placeholder="Enter note title..."
              className="bg-background border-border"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="content"
              className="text-sm font-medium text-card-foreground"
            >
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content here..."
              className="min-h-32 resize-none bg-background border-border"
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
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="border-border">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            {note ? "Update Note" : "Create Note"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
