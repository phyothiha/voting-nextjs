"use client";

import { useTransition } from "react";

export function DeleteAgendaButton({
  agendaId,
  agendaName,
  deleteAction,
}: {
  agendaId: number;
  agendaName: string;
  deleteAction: (id: number) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete Agenda "${agendaName}"?`)) {
      startTransition(async () => {
        await deleteAction(agendaId);
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
