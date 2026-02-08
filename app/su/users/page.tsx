import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const totalCount = await prisma.user.count();

  const users = await prisma.user.findMany({
    where: search
      ? {
          username: {
            contains: search,
          },
        }
      : undefined,
    include: {
      _count: {
        select: { votes: true }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Users <span className="text-lg font-normal text-gray-600">({totalCount} total)</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing latest 20 records. Use search to find more records.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="mb-6">
            <form action="/su/users" method="get">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ""}
                  placeholder="Search by username..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium cursor-pointer"
                >
                  Search
                </button>
                {search && (
                  <a
                    href="/su/users"
                    className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors font-medium cursor-pointer"
                  >
                    Clear
                  </a>
                )}
              </div>
            </form>
          </div>

          {/* Results Info */}
          {search && (
            <div className="mb-4 text-sm text-gray-600">
              {users.length > 0 ? (
                <p>
                  Found {users.length} user{users.length !== 1 ? "s" : ""} matching "{search}"
                </p>
              ) : (
                <p>No users found matching "{search}"</p>
              )}
            </div>
          )}

          {users.length === 0 && !search ? (
            <div className="text-center py-12 text-gray-500">
              No users found.
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Username
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Session Token
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Created At
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Updated At
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Vote History
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.id}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {user.username}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 font-mono">
                        {user.sessionToken.substring(0, 20)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {format(new Date(user.updatedAt), "yyyy-MM-dd HH:mm:ss")}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Link
                          href={`/su/users/${user.id}/votes`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View History ({user._count.votes})
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
