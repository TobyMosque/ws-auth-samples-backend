import { PrismaClient } from '@prisma/client';
import { seedEntities } from './seed/entities';
import { seedIdentity } from './seed/identity';

const prisma = new PrismaClient();
async function main() {
  const { users, roles, links } = await seedIdentity(prisma);
  const { companies, jobs, people } = await seedEntities(prisma);

  if (
    [users, roles, links, companies, jobs, people].every(
      (arr) => !arr || !arr.length,
    )
  ) {
    return;
  }

  const createUsers = prisma.user.createMany({
    data: users,
  });
  const createRoles = prisma.role.createMany({
    data: roles,
  });
  const createLinks = prisma.userRole.createMany({
    data: links,
  });
  const createCompanies = prisma.company.createMany({
    data: companies,
  });
  const createJobs = prisma.job.createMany({
    data: jobs,
  });
  const createPeople = prisma.person.createMany({
    data: people,
  });
  await prisma.$transaction([
    createRoles,
    createUsers,
    createLinks,
    createCompanies,
    createJobs,
    createPeople,
  ]);
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
