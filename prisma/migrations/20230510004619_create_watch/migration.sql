-- CreateTable
CREATE TABLE "Watch" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Watch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Watch_id_key" ON "Watch"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Watch_reference_key" ON "Watch"("reference");

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
