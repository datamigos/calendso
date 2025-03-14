import Head from "next/head";
import prisma from "../../lib/prisma";
import { getSession, useSession } from "next-auth/client";
import Shell from "../../components/Shell";

export default function Bookings({ bookings }) {
  const [session, loading] = useSession();

  if (loading) {
    return <p className="text-gray-400">Loading...</p>;
  }

  return (
    <div>
      <Head>
        <title>Bookings | Calendso</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell heading="Bookings">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.uid}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.attendees[0].name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.attendees[0].email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={window.location.href + "/../reschedule/" + booking.uid}
                            className="text-blue-600 hover:text-blue-900">
                            Reschedule
                          </a>
                          <a
                            href={window.location.href + "/../cancel/" + booking.uid}
                            className="ml-4 text-blue-600 hover:text-blue-900">
                            Cancel
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { redirect: { permanent: false, destination: "/auth/login" } };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
    },
    select: {
      uid: true,
      title: true,
      description: true,
      attendees: true,
    },
  });

  return { props: { bookings } };
}
