-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_personal_info" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "avatar" TEXT,
    "gallery" JSONB NOT NULL DEFAULT [],
    "bio" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_personal_info" ("avatar", "bio", "created_at", "email", "id", "locale", "location", "name", "phone", "title", "updated_at") SELECT "avatar", "bio", "created_at", "email", "id", "locale", "location", "name", "phone", "title", "updated_at" FROM "personal_info";
DROP TABLE "personal_info";
ALTER TABLE "new_personal_info" RENAME TO "personal_info";
CREATE UNIQUE INDEX "personal_info_locale_key" ON "personal_info"("locale");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
