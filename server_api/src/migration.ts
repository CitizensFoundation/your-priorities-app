import { createRequire } from "module";

type PgQueryResult = {
  rows: Array<Record<string, any>>;
};

type PgClient = {
  connect: () => Promise<void>;
  end: () => Promise<void>;
  query: (text: string, values?: any[]) => Promise<PgQueryResult>;
};

type PgClientConfig = {
  connectionString?: string;
  database?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  ssl?: false | { rejectUnauthorized: boolean };
};

type LocalMigration = {
  name: string;
  isNeeded: (client: PgClient) => Promise<boolean>;
  run: (client: PgClient) => Promise<void>;
};

const require = createRequire(import.meta.url);
const { Client } = require("pg") as {
  Client: new (config: PgClientConfig) => PgClient;
};

function getDatabaseConfig(): PgClientConfig | undefined {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DISABLE_PG_SSL ? false : { rejectUnauthorized: false },
    };
  }

  if (
    process.env.YP_DEV_DATABASE_NAME &&
    process.env.YP_DEV_DATABASE_USERNAME &&
    process.env.YP_DEV_DATABASE_HOST
  ) {
    return {
      database: process.env.YP_DEV_DATABASE_NAME,
      user: process.env.YP_DEV_DATABASE_USERNAME,
      password: process.env.YP_DEV_DATABASE_PASSWORD,
      host: process.env.YP_DEV_DATABASE_HOST,
      port: process.env.YP_DEV_DATABASE_PORT
        ? parseInt(process.env.YP_DEV_DATABASE_PORT, 10)
        : 5432,
      ssl: false,
    };
  }

  return undefined;
}

async function tableExists(client: PgClient, tableName: string) {
  const result = await client.query(
    "SELECT to_regclass($1) IS NOT NULL AS exists",
    [`public.${tableName}`]
  );
  return result.rows[0]?.exists === true;
}

async function columnExists(
  client: PgClient,
  tableName: string,
  columnName: string
) {
  const result = await client.query(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = $1
         AND column_name = $2
     ) AS exists`,
    [tableName, columnName]
  );
  return result.rows[0]?.exists === true;
}

async function indexExists(client: PgClient, indexName: string) {
  const result = await client.query(
    `SELECT EXISTS (
       SELECT 1
       FROM pg_indexes
       WHERE schemaname = 'public'
         AND indexname = $1
     ) AS exists`,
    [indexName]
  );
  return result.rows[0]?.exists === true;
}

const migrations: LocalMigration[] = [
  {
    name: "groups.legacy_columns",
    isNeeded: async (client) => {
      if (!(await tableExists(client, "groups"))) {
        return false;
      }

      const requiredColumns = [
        "access",
        "deleted",
        "google_analytics_code",
        "objectives",
        "message_for_new_idea",
        "message_to_users",
        "is_group_folder",
        "in_group_folder_id",
        "weight",
        "status",
        "counter_posts",
        "counter_points",
        "counter_users",
        "counter_flags",
        "theme_id",
        "language",
        "data",
      ];

      for (const columnName of requiredColumns) {
        if (!(await columnExists(client, "groups", columnName))) {
          return true;
        }
      }

      return false;
    },
    run: async (client) => {
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS access INTEGER NOT NULL DEFAULT 0'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS google_analytics_code VARCHAR(255)'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS objectives TEXT'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS message_for_new_idea TEXT'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS message_to_users TEXT'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS is_group_folder BOOLEAN NOT NULL DEFAULT FALSE'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS in_group_folder_id INTEGER'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS weight INTEGER NOT NULL DEFAULT 0'
      );
      await client.query(
        "ALTER TABLE \"groups\" ADD COLUMN IF NOT EXISTS status VARCHAR(255) NOT NULL DEFAULT 'active'"
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS counter_posts INTEGER NOT NULL DEFAULT 0'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS counter_points INTEGER NOT NULL DEFAULT 0'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS counter_users INTEGER NOT NULL DEFAULT 0'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS counter_flags INTEGER NOT NULL DEFAULT 0'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS theme_id INTEGER'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS language VARCHAR(255)'
      );
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS data JSONB'
      );
    },
  },
  {
    name: "domains.user_id",
    isNeeded: async (client) => {
      if (!(await tableExists(client, "domains"))) {
        return false;
      }

      return !(await columnExists(client, "domains", "user_id"));
    },
    run: async (client) => {
      await client.query(
        'ALTER TABLE "domains" ADD COLUMN IF NOT EXISTS user_id INTEGER'
      );
    },
  },
  {
    name: "domains.only_admins_can_create_communities",
    isNeeded: async (client) => {
      if (!(await tableExists(client, "domains"))) {
        return false;
      }

      return !(await columnExists(
        client,
        "domains",
        "only_admins_can_create_communities"
      ));
    },
    run: async (client) => {
      await client.query(
        'ALTER TABLE "domains" ADD COLUMN IF NOT EXISTS only_admins_can_create_communities BOOLEAN DEFAULT FALSE'
      );
    },
  },
  {
    name: "groups.private_access_configuration",
    isNeeded: async (client) => {
      if (!(await tableExists(client, "groups"))) {
        return false;
      }

      const hasColumn = await columnExists(
        client,
        "groups",
        "private_access_configuration"
      );
      const hasIndex = await indexExists(
        client,
        "groups_private_access_configuration_idx"
      );

      return !hasColumn || !hasIndex;
    },
    run: async (client) => {
      await client.query(
        'ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS private_access_configuration JSONB'
      );
      await client.query(
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS groups_private_access_configuration_idx
         ON "groups" USING gin (private_access_configuration jsonb_path_ops)`
      );
    },
  },
];

export async function runLocalMigrations() {
  const config = getDatabaseConfig();

  if (!config) {
    console.warn("Skipping local migrations: no database configuration found");
    return;
  }

  const client = new Client(config);
  await client.connect();

  try {
    for (const migration of migrations) {
      if (await migration.isNeeded(client)) {
        console.log(`Running local migration: ${migration.name}`);
        await migration.run(client);
        console.log(`Completed local migration: ${migration.name}`);
      }
    }
  } finally {
    await client.end();
  }
}
