import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import {
  PrismaClient,
  Prisma,
  User,
  Role,
  UserRole,
  Session,
} from '@prisma/client';

type Entity = Partial<{
  isDeleted: boolean | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}>;

enum NavigationType {
  single = 'single',
  many = 'many',
}
class EntityMiddlewareOptions<TCreate extends Partial<Entity>> {
  name: Prisma.ModelName;
  props?: Partial<
    Record<
      keyof Omit<TCreate, keyof Entity>,
      { prop: EntityMiddlewareOptions<unknown>; type: NavigationType }
    >
  > = {};
}

function EntityMiddlewareFactory<T extends Partial<Entity>>({
  name,
  props,
}: EntityMiddlewareOptions<T>): Prisma.Middleware {
  return function entityMiddleware(params, next) {
    if (params.model !== name) {
      return next(params);
    }
    type TEntity = Required<T>;

    function extendQuery({
      args,
      type,
      props,
    }: {
      args: { select?: TEntity; where?: TEntity };
      type?: NavigationType;
      props: Partial<
        Record<
          string,
          { prop: EntityMiddlewareOptions<unknown>; type: NavigationType }
        >
      >;
    }) {
      if (type !== NavigationType.single) {
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
      if (args.select) {
        for (const key in props) {
          if (key in args.select) {
            if (typeof args.select[key] === 'boolean') {
              args.select[key] = {};
            }
            extendQuery({
              args: args.select[key],
              type: props[key].type,
              props: props[key].prop.props,
            });
          }
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
        props,
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
    return next(params);
  };
}

const userOptions: EntityMiddlewareOptions<Prisma.UserCreateInput> = {
  name: Prisma.ModelName.User,
  props: {},
};

const roleOptions: EntityMiddlewareOptions<Prisma.RoleCreateInput> = {
  name: Prisma.ModelName.Role,
  props: {},
};

const userRoleOptions: EntityMiddlewareOptions<Prisma.UserRoleCreateInput> = {
  name: Prisma.ModelName.UserRole,
  props: {},
};

const sessionOptions: EntityMiddlewareOptions<Prisma.SessionCreateInput> = {
  name: Prisma.ModelName.Session,
  props: {},
};

sessionOptions.props.user = { prop: userOptions, type: NavigationType.single };
userRoleOptions.props.user = { prop: userOptions, type: NavigationType.single };
userRoleOptions.props.role = { prop: roleOptions, type: NavigationType.single };

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(EntityMiddlewareFactory<User>(userOptions));
    this.$use(EntityMiddlewareFactory<Role>(roleOptions));
    this.$use(EntityMiddlewareFactory<UserRole>(userRoleOptions));
    this.$use(EntityMiddlewareFactory<Session>(sessionOptions));
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
