-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FOOD', 'TRANSPORTATION', 'HOUSING', 'UTILITIES', 'ENTERTAINMENT', 'HEALTHCARE', 'PERSONAL_CARE', 'EDUCATION', 'GIFTS', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "category" "Category",
    "currency" "Currency",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Expense_userId_idx" ON "Expense"("userId");

-- CreateIndex
CREATE INDEX "Expense_name_idx" ON "Expense"("name");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- CreateIndex
CREATE INDEX "Expense_currency_idx" ON "Expense"("currency");

-- CreateIndex
CREATE INDEX "Expense_amount_idx" ON "Expense"("amount");

-- CreateIndex
CREATE INDEX "Expense_userId_createdAt_idx" ON "Expense"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Expense_userId_date_idx" ON "Expense"("userId", "date" DESC);

-- CreateIndex
CREATE INDEX "Expense_userId_category_idx" ON "Expense"("userId", "category");

-- CreateIndex
CREATE INDEX "Expense_userId_amount_idx" ON "Expense"("userId", "amount" DESC);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
