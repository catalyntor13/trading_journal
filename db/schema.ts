import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));


export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const trading_accounts = pgTable("trading_accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  balance: text("balance"),
  type: text("type"), // live, demo, funded
  broker: text("broker"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const trading_accountsRelations = relations(trading_accounts, ({ one, many }) => ({
  user: one(user, {
    fields: [trading_accounts.userId],
    references: [user.id],
  }),
  trades: many(TradingAccountsData),
}));

export const TradingAccountsData = pgTable("trading_accounts_data", {
  id: text("id").primaryKey(),
  pair: text("pair"),
  strategy: text("strategy"),
  direction: text("direction"), // Buy/Sell
  profit: text("profit"), // Gross Profit
  commission: text("commission"),
  riskPercent: text("risk_percent"),
  tod: text("tod"),
  riskRatio: text("risk_ratio"),
  comments: text("comments"),
  image1: text("image1"),
  image2: text("image2"),
  fearIndex: text("fear_index"), // Scale 1-10
  accountId: text("account_id")
    .notNull()
    .references(() => trading_accounts.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trading_accountsDataRelations = relations(TradingAccountsData, ({ one }) => ({
  account: one(trading_accounts, {
    fields: [TradingAccountsData.accountId],
    references: [trading_accounts.id],
  }),
}));

export const strategies = pgTable("strategies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // Title
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const strategiesRelations = relations(strategies, ({ one }) => ({
  user: one(user, {
    fields: [strategies.userId],
    references: [user.id],
  }),
}));

