/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Zap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Zap_name_key" ON "Zap"("name");
