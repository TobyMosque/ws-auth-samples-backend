import { PrismaClient, Prisma } from '@prisma/client';
import { v4 as uid } from 'uuid';
import { promisify } from 'util';
import { randomBytes, scrypt } from 'crypto';

const randomBytesAsync = promisify(randomBytes);
const scryptAsync = promisify(scrypt);

const newUsers: Prisma.UserCreateManyInput[] = [];
const newRoles: Prisma.RoleCreateManyInput[] = [];
const newLinks: Prisma.UserRoleCreateManyInput[] = [];

const _date = new Date();
function comb({ date }: { date?: Date } = {}): string {
  if (!date) {
    _date.setTime(_date.getTime() + 1);
    date = _date;
  }
  const uuid = uid();
  let comb = ('00000000000' + date.getTime().toString(16)).substr(-12);
  comb = comb.slice(0, 8) + '-' + comb.slice(8, 12);
  return uuid.replace(uuid.slice(0, 13), comb);
}
/*
faker.locale = 'en_US';
function getCompanyName() {
  let name = faker.company.companyName();
  while (companies.some((j) => j.name === name)) {
    name = faker.company.companyName();
  }
  return name;
}
function getJobName() {
  let name = faker.name.jobTitle();
  while (jobs.some((j) => j.name === name)) {
    name = faker.name.jobTitle();
  }
  return name;
}
function getPersonInfo(gender: 'male' | 'female') {
  let firstName = faker.name.firstName(gender);
  let lastName = faker.name.lastName(gender);
  while (
    people.some((j) => j.firstName === firstName && j.lastName === lastName)
  ) {
    firstName = faker.name.firstName(gender);
    lastName = faker.name.lastName(gender);
  }
  const section = gender === 'male' ? 'men' : 'women';
  const index = faker.helpers.randomize(avatars[section]);
  const avatar = `https://randomuser.me/api/portraits/${section}/${index}.jpg`;
  const email = faker.internet.email(firstName, lastName).toLowerCase();
  return { firstName, lastName, email, avatar };
}

for (let i = 0; i < 50; i++) {
  companies.push({
    companyId: comb(),
    name: getCompanyName(),
  });
}

for (let i = 0; i < 100; i++) {
  jobs.push({
    jobId: comb(),
    name: getJobName(),
  });
}

for (let i = 0; i < 800; i++) {
  const companyIndex = Math.floor(Math.random() * Math.floor(companies.length));
  const jobIndex = Math.floor(Math.random() * Math.floor(jobs.length));
  const company = companies[companyIndex];
  const job = jobs[jobIndex];
  const gender: 'male' | 'female' = faker.helpers.randomize(['male', 'female']);
  const { firstName, lastName, email, avatar } = getPersonInfo(gender);

  people.push({
    personId: comb(),
    avatar: avatar,
    firstName: firstName,
    lastName: lastName,
    email: email,
    companyId: company.companyId,
    jobId: job.jobId,
  });
}
*/

const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.findMany({
    select: {
      roleId: true,
      name: true,
    },
  });
  const roleNames = ['developer', 'admin', 'user'];
  const oldRoleNames = roles.map((role) => role.name);
  const newRoleNames = roleNames.filter((name) => !oldRoleNames.includes(name));

  if (newRoleNames && newRoleNames.length > 0) {
    for (const roleName of newRoleNames) {
      const newRole = {
        roleId: comb(),
        name: roleName,
      };
      roles.push(newRole);
      newRoles.push(newRole);
    }
  }

  const email = 'me@tobiasmesquita.dev';
  let user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      userId: true,
    },
  });
  if (!user?.userId) {
    const salt = await randomBytesAsync(16);
    const pass = (await scryptAsync('KeepIt$uper$ecret', salt, 64)) as Buffer;
    const newUser = {
      userId: comb(),
      email: email,
      firstName: 'Tobias',
      lastName: 'Mesquita',
      password: pass,
      salt: salt,
    };
    newUsers.push(newUser);
    user = { userId: newUser.userId };
  }

  const links = await prisma.userRole.findMany({
    where: {
      userId: user.userId,
    },
    select: {
      roleId: true,
    },
  });

  const roleIds = roles.map((role) => role.roleId);
  const oldRoleIds = links.map((link) => link.roleId);
  const newRoleIds = roleIds.filter((linkId) => !oldRoleIds.includes(linkId));

  if (newRoleIds && newRoleIds.length > 0) {
    const userId = user.userId;
    for (const roleId of newRoleIds) {
      const newLink = {
        userRoleId: comb(),
        roleId: roleId,
        userId: userId,
      };
      newLinks.push(newLink);
    }
  }

  const hasNoNewsRoles = !newRoles || newRoles.length === 0;
  const hasNoNewsUsers = !newUsers || newUsers.length === 0;
  const hasNoNewsLinks = !newRoles || newRoles.length === 0;
  if (hasNoNewsRoles && hasNoNewsUsers && hasNoNewsLinks) {
    return;
  }

  const createRoles = prisma.role.createMany({
    data: newRoles,
  });
  const createUsers = prisma.user.createMany({
    data: newUsers,
  });
  const createLinks = prisma.userRole.createMany({
    data: newLinks,
  });

  await prisma.$transaction([createRoles, createUsers, createLinks]);
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
