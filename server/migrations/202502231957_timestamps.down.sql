ALTER TABLE "chat"
DROP COLUMN created_at,
DROP COLUMN updated_at;

ALTER TABLE "user"
DROP COLUMN created_at,
DROP COLUMN updated_at;

ALTER TABLE "chat_user"
DROP COLUMN created_at,
DROP COLUMN updated_at;
