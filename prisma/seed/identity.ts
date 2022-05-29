import { PrismaClient, Prisma } from '@prisma/client';

import { comb, randomBytesAsync, scryptAsync } from './common';

const roleNames = ['developer', 'admin', 'user'];
const users = [
  {
    email: 'me@tobiasmesquita.dev',
    pass: 'KeepIt$uper$ecret',
    roles: ['developer', 'admin', 'user'],
  },
  {
    email: 'admin@tobiasmesquita.dev',
    pass: 'KeepIt$uper$ecret',
    roles: ['admin', 'user'],
  },
  {
    email: 'user@tobiasmesquita.dev',
    pass: 'KeepIt$uper$ecret',
    roles: ['user'],
  },
];

export async function seedIdentity(prisma: PrismaClient) {
  const result = {
    users: [] as Prisma.UserCreateManyInput[],
    roles: [] as Prisma.RoleCreateManyInput[],
    links: [] as Prisma.UserRoleCreateManyInput[],
  };

  const roles = await prisma.role.findMany({
    select: {
      roleId: true,
      name: true,
    },
  });

  const oldRoleNames = roles.map((role) => role.name);
  const newRoleNames = roleNames.filter((name) => !oldRoleNames.includes(name));

  if (newRoleNames && newRoleNames.length > 0) {
    for (const roleName of newRoleNames) {
      const newRole = {
        roleId: comb(),
        name: roleName,
      };
      roles.push(newRole);
      result.roles.push(newRole);
    }
  }

  for (const user of users) {
    let dbUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
      select: {
        userId: true,
      },
    });
    if (!dbUser?.userId) {
      const salt = await randomBytesAsync(16);
      const pass = (await scryptAsync(user.pass, salt, 64)) as Buffer;
      const newUser = {
        userId: comb(),
        email: user.email,
        firstName: 'Tobias',
        lastName: 'Mesquita',
        password: pass,
        salt: salt,
      };
      result.users.push(newUser);
      dbUser = { userId: newUser.userId };
    }

    const links = await prisma.userRole.findMany({
      where: {
        userId: dbUser.userId,
      },
      select: {
        roleId: true,
      },
    });

    const roleIds = roles
      .filter((role) => user.roles.includes(role.name))
      .map((role) => role.roleId);
    const oldRoleIds = links.map((link) => link.roleId);
    const newRoleIds = roleIds.filter((linkId) => !oldRoleIds.includes(linkId));

    if (newRoleIds && newRoleIds.length > 0) {
      const userId = dbUser.userId;
      for (const roleId of newRoleIds) {
        const newLink = {
          userRoleId: comb(),
          roleId: roleId,
          userId: userId,
        };
        result.links.push(newLink);
      }
    }
  }

  return result;
}
