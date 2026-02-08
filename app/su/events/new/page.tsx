import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function createEvent(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sortOrder = formData.get("sortOrder") as string;
  const agendaId = formData.get("agendaId") as string;

  await prisma.event.create({
    data: {
      name,
      description: description || null,
      sortOrder: parseInt(sortOrder) || 1,
      agendaId: parseInt(agendaId),
    },
  });

  redirect("/su/events");
}

export default async function NewEventPage() {
  const agendas = await prisma.agenda.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Create New Event
          </h1>

          <form action={createEvent} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Name *
              </label>
              <textarea
                id="name"
                name="name"
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none resize-none"
                placeholder="e.g., သီချင်းအဆို"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none resize-none"
                placeholder="e.g., ပထမဆု - 500,000 ကျပ်"
              />
            </div>

            <div>
              <label
                htmlFor="agendaId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Agenda *
              </label>
              <select
                id="agendaId"
                name="agendaId"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white"
              >
                <option value="">Select an agenda</option>
                {agendas.map((agenda) => (
                  <option key={agenda.id} value={agenda.id}>
                    {agenda.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sortOrder"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sort Order
              </label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                defaultValue={1}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="cursor-pointer flex-1 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Create Event
              </button>
              <a
                href="/su/events"
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium text-center"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
