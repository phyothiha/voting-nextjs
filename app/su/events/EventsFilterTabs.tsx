"use client";

import { useState } from "react";
import { format } from "date-fns";

type Event = {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  agendaId: number;
  createdAt: Date;
  updatedAt: Date;
  agenda: {
    id: number;
    name: string;
  };
  _count: {
    votes: number;
  };
};

type Agenda = {
  id: number;
  name: string;
  sortOrder: number;
};

type EventsFilterTabsProps = {
  events: Event[];
  agendas: Agenda[];
};

export function EventsFilterTabs({ events, agendas }: EventsFilterTabsProps) {
  const [selectedAgendaId, setSelectedAgendaId] = useState<number | null>(null);

  const filteredEvents = selectedAgendaId
    ? events.filter((event) => event.agendaId === selectedAgendaId)
    : events;

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedAgendaId(null)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
              selectedAgendaId === null
                ? "border-gray-700 text-gray-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All ({events.length})
          </button>
          {agendas.map((agenda) => {
            const count = events.filter((e) => e.agendaId === agenda.id).length;
            return (
              <button
                key={agenda.id}
                onClick={() => setSelectedAgendaId(agenda.id)}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                  selectedAgendaId === agenda.id
                    ? "border-gray-700 text-gray-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {agenda.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {selectedAgendaId
            ? "No events found for this agenda."
            : "No events found. Create your first event!"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Sort Order
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Agenda
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Vote Count
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Created At
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {event.id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {event.sortOrder}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800 whitespace-pre-line">
                    {event.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-pre-line">
                    {event.description || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {event.agenda.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {event._count.votes}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {format(new Date(event.createdAt), "yyyy-MM-dd hh:mm:ss a")}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {format(new Date(event.updatedAt), "yyyy-MM-dd hh:mm:ss a")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
