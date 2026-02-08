import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UserVotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    notFound();
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      playerNumber: true,
      name: true,
      department: true,
      createdAt: true,
    },
  });

  if (!user) {
    notFound();
  }

  // Get user's voting history with agenda and event details
  const votes = await prisma.vote.findMany({
    where: { userId: userId },
    include: {
      agenda: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      event: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/su/users"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
            >
              ← Back to Users
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Vote History for {user.name} (Player #{user.playerNumber})
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              User ID: {user.id} • {user.department && `Department: ${user.department} • `}Member since: {format(new Date(user.createdAt), "yyyy-MM-dd hh:mm:ss a")}
            </p>
          </div>

          {/* Vote Count Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-blue-900">
                Total Votes: {votes.length}
              </p>
            </div>
          </div>

          {/* Votes Table */}
          {votes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-lg font-medium">No voting history</p>
              <p className="text-sm mt-1">This user hasn't voted yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Vote ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Agenda
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Event Voted For
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Voted At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {votes.map((vote) => (
                    <tr
                      key={vote.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {vote.id}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-800 whitespace-pre-line">
                            {vote.agenda.name}
                          </p>
                          {/* {vote.agenda.description && (
                            <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">
                              {vote.agenda.description}
                            </p>
                          )} */}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-800 whitespace-pre-line">
                            {vote.event.name}
                          </p>
                          {vote.event.description && (
                            <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">
                              {vote.event.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {format(new Date(vote.createdAt), "yyyy-MM-dd hh:mm:ss a")}
                      </td>
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
