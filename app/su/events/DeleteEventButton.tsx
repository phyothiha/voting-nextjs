"use client";

import { useTransition } from "react";

export function DeleteEventButton({
  eventId,
  eventName,
  deleteAction,
}: {
  eventId: number;
  eventName: string;
  deleteAction: (id: number) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {    
    if (window.confirm(`Are you sure you want to delete Event "${eventName}"?`)) {
      startTransition(async () => {
        await deleteAction(eventId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-800 disabled:text-gray-400 cursor-pointer"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
