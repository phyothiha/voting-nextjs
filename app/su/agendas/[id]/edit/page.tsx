import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function updateAgenda(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sortOrder = formData.get("sortOrder") as string;

  await prisma.agenda.update({
    where: { id },
    data: {
      name,
      description: description || null,
      sortOrder: parseInt(sortOrder) || 1,
    },
  });

  redirect("/su/agendas");
}

export default async function EditAgendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);

  if (isNaN(id)) {
    notFound();
  }

  const agenda = await prisma.agenda.findUnique({
    where: { id },
  });

  if (!agenda) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Agenda
          </h1>

          <form action={updateAgenda.bind(null, id)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Agenda Name *
              </label>
              <textarea
                id="name"
                name="name"
                required
                rows={3}
                defaultValue={agenda.name}
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
                defaultValue={agenda.description || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none resize-none"
                placeholder="e.g., ပထမဆု - 500,000 ကျပ်"
              />
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
                defaultValue={agenda.sortOrder}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="cursor-pointer flex-1 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Update Agenda
              </button>
              <a
                href="/su/agendas"
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
