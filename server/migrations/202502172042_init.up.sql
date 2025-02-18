CREATE TABLE "chat"
(
    "id"          serial       NOT NULL,
    "telegram_id" bigint       NOT NULL,
    "name"        varchar(255) NOT NULL,
    "avatar"      text         NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "user"
(
    "id"          varchar(255) NOT NULL DEFAULT gen_random_uuid(),
    "telegram_id" bigint       NOT NULL,
    "first_name"  varchar(255) NOT NULL,
    "last_name"   varchar(255) NOT NULL,
    "company"     varchar(255),
    "role"        varchar(255),
    "bio"         text,
    PRIMARY KEY ("id")
);

CREATE TABLE "chat_user"
(
    "chat_id" serial       NOT NULL,
    "user_id" varchar(255) NOT NULL,
    PRIMARY KEY ("chat_id", "user_id"),
    FOREIGN KEY ("chat_id") REFERENCES "chat" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);
