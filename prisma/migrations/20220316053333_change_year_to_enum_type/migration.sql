/*
  Warnings:

  - Changed the type of `year` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Year" AS ENUM ('Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8', 'MASTER_DEGREE', 'PHD');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "year",
ADD COLUMN     "year" "Year" NOT NULL;
