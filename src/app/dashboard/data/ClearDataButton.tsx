"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteAllDataAction } from "../actions";
import {
  AlertDialog,

  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ClearDataButton() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClear = async () => {
    setLoading(true);
    const result = await deleteAllDataAction();
    if (result.success) {
      window.location.reload();
    } else {
      alert("Failed to delete data: " + result.error);
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your uploaded data, including pages, keywords, competitors, and technical issues from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={(e) => {
              e.preventDefault();
              handleClear();
            }}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, delete everything"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
