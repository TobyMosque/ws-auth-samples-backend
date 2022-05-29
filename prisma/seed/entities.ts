import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { comb } from './common';

const avatars = {
  men: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
    79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
  ],
  women: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
    79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
  ],
  lego: [1, 2, 3, 4, 5, 6, 7, 8],
};

export async function seedEntities(prisma: PrismaClient) {
  const result = {
    companies: [] as Prisma.CompanyCreateManyInput[],
    jobs: [] as Prisma.JobCreateManyInput[],
    people: [] as Prisma.PersonCreateManyInput[],
  };
  const job = await prisma.job.findFirst({
    select: {
      jobId: true,
    },
  });
  if (job?.jobId) {
    return result;
  }
  const company = await prisma.company.findFirst({
    select: {
      companyId: true,
    },
  });
  if (company?.companyId) {
    return result;
  }
  const person = await prisma.person.findFirst({
    select: {
      personId: true,
    },
  });

  if (person?.personId) {
    return result;
  }

  faker.locale = 'en_US';
  function getCompanyName() {
    let name = faker.company.companyName();
    while (result.companies.some((j) => j.name === name)) {
      name = faker.company.companyName();
    }
    return name;
  }
  function getJobName() {
    let name = faker.name.jobTitle();
    while (result.jobs.some((j) => j.name === name)) {
      name = faker.name.jobTitle();
    }
    return name;
  }
  function getPersonInfo(gender: 'male' | 'female') {
    let firstName = faker.name.firstName(gender);
    let lastName = faker.name.lastName(gender);
    while (
      result.people.some(
        (j) => j.firstName === firstName && j.lastName === lastName,
      )
    ) {
      firstName = faker.name.firstName(gender);
      lastName = faker.name.lastName(gender);
    }
    const section = gender === 'male' ? 'men' : 'women';
    const index = faker.helpers.arrayElement(avatars[section]);
    const avatar = `https://randomuser.me/api/portraits/${section}/${index}.jpg`;
    const email = faker.internet.email(firstName, lastName).toLowerCase();
    return { firstName, lastName, email, avatar };
  }

  for (let i = 0; i < 50; i++) {
    result.companies.push({
      companyId: comb(),
      name: getCompanyName(),
    });
  }

  for (let i = 0; i < 100; i++) {
    result.jobs.push({
      jobId: comb(),
      name: getJobName(),
    });
  }

  for (let i = 0; i < 800; i++) {
    const companyIndex = Math.floor(
      Math.random() * Math.floor(result.companies.length),
    );
    const jobIndex = Math.floor(Math.random() * Math.floor(result.jobs.length));
    const company = result.companies[companyIndex];
    const job = result.jobs[jobIndex];
    const gender: 'male' | 'female' = faker.helpers.arrayElement([
      'male',
      'female',
    ]);
    const { firstName, lastName, email, avatar } = getPersonInfo(gender);

    result.people.push({
      personId: comb(),
      avatar: avatar,
      firstName: firstName,
      lastName: lastName,
      email: email,
      companyId: company.companyId,
      jobId: job.jobId,
    });
  }

  return result;
}
