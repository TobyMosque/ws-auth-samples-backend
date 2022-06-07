import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import {
  PrismaClient,
  Prisma,
  User,
  Role,
  UserRole,
  Session,
  Person,
  Company,
  Job,
} from '@prisma/client';

type Entity = Partial<{
  isDeleted: boolean | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}>;

class EntityMiddlewareOptions<TCreate extends Partial<Entity>> {
  name: Prisma.ModelName;
  configure: (entity: EntityMiddlewareOptions<TCreate>) => void;
  hasOne?: Partial<
    Record<keyof Omit<TCreate, keyof Entity>, EntityMiddlewareOptions<unknown>>
  > = {};
  hasMany?: Partial<
    Record<keyof Omit<TCreate, keyof Entity>, EntityMiddlewareOptions<unknown>>
  > = {};

  constructor(
    name: Prisma.ModelName,
    configure: (entity: EntityMiddlewareOptions<TCreate>) => void,
  ) {
    this.name = name;
    this.configure = configure;
    this.hasOne = {};
    this.hasMany = {};
  }
}

function EntityMiddlewareFactory<T extends Partial<Entity>>(
  options: EntityMiddlewareOptions<T>,
): Prisma.Middleware {
  const { name, hasOne, hasMany, configure } = options;
  configure(options);
  return function entityMiddleware(params, next) {
    if (params.model !== name) {
      return next(params);
    }
    type TEntity = Required<T>;

    function extendQuery({
      args,
      hasOne,
      hasMany,
      hasWhere = true,
    }: {
      args: { select?: TEntity; where?: TEntity; include?: TEntity };
      hasOne: Partial<Record<string, EntityMiddlewareOptions<unknown>>>;
      hasMany: Partial<Record<string, EntityMiddlewareOptions<unknown>>>;
      hasWhere?: boolean;
    }) {
      if (hasWhere) {
        if (!args.where) {
          args.where = {} as TEntity;
        }
        if (typeof args.where === 'string') {
          args.where = JSON.parse(args.where) as TEntity;
        }
        switch (args.where.isDeleted) {
          case undefined:
            args.where.isDeleted = false;
            break;
          case 'all':
            args.where.isDeleted = undefined;
            break;
        }
      }
      for (const field of ['select', 'include']) {
        if (!args[field]) {
          continue;
        }
        for (const key in hasMany) {
          if (!(key in args[field])) {
            continue;
          }
          const prop = hasMany[key];
          if (typeof args[field][key] === 'boolean') {
            args[field][key] = {};
          }
          extendQuery({
            args: args[field][key],
            hasOne: prop.hasOne,
            hasMany: prop.hasMany,
          });
        }
        for (const key in hasOne) {
          if (!(key in args[field]) || typeof args[field][key] === 'boolean') {
            continue;
          }
          const prop = hasOne[key];
          extendQuery({
            args: args[field][key],
            hasOne: prop.hasOne,
            hasMany: prop.hasMany,
            hasWhere: false,
          });
        }
      }
    }
    function setCreated(key: 'data' | 'create' = 'data') {
      const args: { [key: string]: TEntity } = params.args || {};
      if (!args[key]) {
        args[key] = {} as TEntity;
      }
      args[key].createdAt = args[key].updatedAt = new Date();
    }
    function setUpdated(key: 'data' | 'update' = 'data') {
      const args: { [key: string]: TEntity } = params.args || {};
      if (!args[key]) {
        args[key] = {} as TEntity;
      }
      args[key].updatedAt = new Date();
    }
    function queryFilter() {
      extendQuery({
        args: params.args || {},
        hasOne,
        hasMany,
      });
    }
    function onCreated() {
      setCreated();
    }
    function onUpdated() {
      setUpdated();
    }
    function onUpserted() {
      setCreated('create');
      setUpdated('update');
    }
    function onDeleted() {
      switch (params.action) {
        case 'delete':
          params.action = 'update';
          break;
        case 'deleteMany':
          params.action = 'updateMany';
          break;
      }
      const args: { data: TEntity } = params.args || {};
      if (!args.data) {
        args.data = {} as TEntity;
      }
      args.data.isDeleted = true;
      args.data.deletedAt = new Date();
    }
    switch (params.action) {
      case 'findFirst':
      case 'findMany':
        queryFilter();
        break;
      case 'create':
      case 'createMany':
        onCreated();
        break;
      case 'update':
      case 'updateMany':
        onUpdated();
        break;
      case 'upsert':
        onUpserted();
        break;
      case 'delete':
      case 'deleteMany':
        onDeleted();
        break;
    }
    // console.log(JSON.stringify(params, null, 2));
    return next(params);
  };
}

const userOptions = new EntityMiddlewareOptions<Prisma.UserCreateInput>(
  Prisma.ModelName.User,
  (entity) => {
    entity.hasMany.sessions = sessionOptions;
    entity.hasMany.roles = userRoleOptions;
  },
);

const roleOptions = new EntityMiddlewareOptions<Prisma.RoleCreateInput>(
  Prisma.ModelName.Role,
  (entity) => {
    entity.hasMany.users = userRoleOptions;
  },
);

const userRoleOptions = new EntityMiddlewareOptions<Prisma.UserRoleCreateInput>(
  Prisma.ModelName.UserRole,
  (entity) => {
    entity.hasOne.user = userOptions;
    entity.hasOne.role = roleOptions;
  },
);

const sessionOptions = new EntityMiddlewareOptions<Prisma.SessionCreateInput>(
  Prisma.ModelName.Session,
  (entity) => {
    entity.hasOne.user = userOptions;
  },
);

const personOptions = new EntityMiddlewareOptions<Prisma.PersonCreateInput>(
  Prisma.ModelName.Session,
  (entity) => {
    entity.hasOne.job = jobOptions;
    entity.hasOne.company = companyOptions;
  },
);

const jobOptions = new EntityMiddlewareOptions<Prisma.JobCreateInput>(
  Prisma.ModelName.Session,
  (entity) => {
    entity.hasMany.people = personOptions;
  },
);

const companyOptions = new EntityMiddlewareOptions<Prisma.CompanyCreateInput>(
  Prisma.ModelName.Session,
  (entity) => {
    entity.hasMany.people = personOptions;
  },
);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(EntityMiddlewareFactory<User>(userOptions));
    this.$use(EntityMiddlewareFactory<Role>(roleOptions));
    this.$use(EntityMiddlewareFactory<UserRole>(userRoleOptions));
    this.$use(EntityMiddlewareFactory<Session>(sessionOptions));
    this.$use(EntityMiddlewareFactory<Person>(personOptions));
    this.$use(EntityMiddlewareFactory<Job>(jobOptions));
    this.$use(EntityMiddlewareFactory<Company>(companyOptions));
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
