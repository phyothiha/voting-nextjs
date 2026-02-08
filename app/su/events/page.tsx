import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { DeleteEventButton } from "./DeleteEventButton";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EventsFilterTabs } from "./EventsFilterTabs";

async function deleteEvent(id: number) {
  "use server";
  
  await prisma.event.delete({
    where: { id },
  });
  
  revalidatePath("/su/events");
  redirect("/su/events");
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      agenda: true,
      _count: {
        select: { votes: true }
      }
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  const agendas = await prisma.agenda.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Events <span className="text-lg font-normal text-gray-600">({events.length} total)</span>
            </h1>
            <Link
              href="/su/events/new"
              className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium cursor-pointer"
            >
              Create New Event
            </Link>
          </div>

          <EventsFilterTabs events={events} agendas={agendas} />
        </div>
      </div>
    </div>
  );
}
