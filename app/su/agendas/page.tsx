import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { DeleteAgendaButton } from "./DeleteAgendaButton";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function deleteAgenda(id: number) {
  "use server";
  
  await prisma.agenda.delete({
    where: { id },
  });
  
  revalidatePath("/su/agendas");
  redirect("/su/agendas");
}

export default async function AgendasPage() {
  const agendas = await prisma.agenda.findMany({
    include: {
      events: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Agendas</h1>
            <Link
              href="/su/agendas/new"
              className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Create New Agenda
            </Link>
          </div>

          {agendas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No agendas found. Create your first agenda!
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
                      Events Count
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
                  {agendas.map((agenda) => (
                    <tr
                      key={agenda.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {agenda.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {agenda.sortOrder}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800 whitespace-pre-line">
                        {agenda.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {agenda.events.length}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {format(new Date(agenda.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {format(new Date(agenda.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                      </td>
                      {/* <td className="py-3 px-4 text-sm">
                        <div className="flex gap-3">
                          <Link
                            href={`/su/agendas/${agenda.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                          <DeleteAgendaButton
                            agendaId={agenda.id}
                            agendaName={agenda.name}
                            deleteAction={deleteAgenda}
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
