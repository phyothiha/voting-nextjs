import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { DeleteEventButton } from "./DeleteEventButton";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Events</h1>
            <Link
              href="/su/events/new"
              className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Create New Event
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No events found. Create your first event!
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
                      Created At
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Updated At
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
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
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {format(new Date(event.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {format(new Date(event.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                      </td>
                      {/* <td className="py-3 px-4 text-sm">
                        <div className="flex gap-3">
                          <Link
                            href={`/su/events/${event.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                          <DeleteEventButton
                            eventId={event.id}
                            eventName={event.name}
                            deleteAction={deleteEvent}
                          />
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
