-- AlterTable
ALTER TABLE "projects" ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "projects" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "project_likes" (
    "project_id" TEXT NOT NULL,
    "visitor_key" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("project_id", "visitor_key"),
    CONSTRAINT "project_likes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_views" (
    "project_id" TEXT NOT NULL,
    "visitor_key" TEXT NOT NULL,
    "last_viewed_at" DATETIME NOT NULL,

    PRIMARY KEY ("project_id", "visitor_key"),
    CONSTRAINT "project_views_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
