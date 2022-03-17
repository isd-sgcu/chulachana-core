-- CreateTable
CREATE TABLE "UserCountLog" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL,

    CONSTRAINT "UserCountLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCountLog" ADD CONSTRAINT "UserCountLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCountLog" ADD CONSTRAINT "UserCountLog_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
