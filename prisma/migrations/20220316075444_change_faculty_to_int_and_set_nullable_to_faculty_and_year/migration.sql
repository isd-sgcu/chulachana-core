/*
  Warnings:

  - The `faculty` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "faculty",
ADD COLUMN     "faculty" INTEGER,
ALTER COLUMN "year" DROP NOT NULL;
