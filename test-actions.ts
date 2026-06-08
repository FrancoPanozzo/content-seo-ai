
import { prisma } from './src/lib/prisma';

async function main() {
  const actions = await prisma.action.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      upload: {
        select: {
          id: true,
          createdAt: true
        }
      }
    }
  });

  console.log(`Found ${actions.length} recent actions:`);

  actions.forEach((a, i) => {
    console.log(`\n--- Action ${i + 1} ---`);
    console.log(`Type: ${a.type}`);
    console.log(`Title: ${a.title}`);
    console.log(`Priority: ${a.priority} | Confidence: ${a.confidence}`);
    console.log(`Reason: ${a.reason}`);
    console.log(`Evidence: ${a.evidence}`);
    console.log(`Payload:`, JSON.stringify(a.payload, null, 2));
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
