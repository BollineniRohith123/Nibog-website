import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { prisma } from '../lib/db';

interface CityPageProps {
  events: Array<{
    id: string;
    name: string;
    description: string;
    city: {
      name: string;
    };
  }>;
}

const CityPage: React.FC<CityPageProps> = ({ events }) => {
  const router = useRouter();
  const { city } = router.query;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Events in {city}</h1>
      {events.length === 0 ? (
        <p>No events found in this city.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cityName = context.params?.city as string;

  const events = await prisma.event.findMany({
    where: { 
      city: {
        name: cityName
      }
    },
    include: {
      city: true
    }
  });

  return {
    props: {
      events: JSON.parse(JSON.stringify(events)),
    },
  };
};

export default CityPage;
