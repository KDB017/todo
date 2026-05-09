-- CreateTable
CREATE TABLE "User" (
    "mail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "achievement" INTEGER NOT NULL DEFAULT 0,
    "achievement_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("mail")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
