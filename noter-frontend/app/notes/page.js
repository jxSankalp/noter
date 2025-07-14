"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Tag, BookOpen } from "lucide-react";
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
import { NoteModal } from "@/components/NotesModal";
import { toast } from "sonner";
import api from "@/lib/axios";  
import { useRouter } from "next/navigation";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);


  // ✅ Fetch all notes on load
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (err) {
        toast.error("Failed to load notes");
        console.error(err);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (err) {
      toast.error("Failed to delete note");
      console.error(err);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (selectedNote) {
        const res = await api.put(`/notes/${selectedNote._id}`, noteData);
        setNotes((prev) =>
          prev.map((note) => (note._id === selectedNote._id ? res.data : note))
        );
        toast.success("Note updated successfully");
      } else {
        const res = await api.post("/notes", noteData);
        setNotes((prev) => [res.data, ...prev]);
        toast.success("Note added successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save note");
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Notes</h1>
            <p className="text-muted-foreground mt-1">
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1 ? "note" : "notes"}
            </p>
          </div>
          <Button
            onClick={handleAddNote}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card
              key={note._id}
              className="group hover:shadow-hover transition-all duration-200 border-border bg-card animate-fade-in"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-1">
                    {note.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                      className="h-8 w-8 p-0 hover:bg-accent"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note._id)}
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-card-foreground mb-4 line-clamp-3">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
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

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first note to get started"}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleAddNote}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Note
              </Button>
            )}
          </div>
        )}
      </div>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        note={selectedNote}
      />
    </div>
  );
}
