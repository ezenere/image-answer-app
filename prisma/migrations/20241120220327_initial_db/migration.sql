-- CreateTable
CREATE TABLE "Answers" (
    "AnswerId" SERIAL NOT NULL,
    "AnswerCollection" INTEGER NOT NULL,
    "AnswerImage" INTEGER NOT NULL,
    "AnswerText" VARCHAR(500) NOT NULL,

    CONSTRAINT "Answers_pkey" PRIMARY KEY ("AnswerId")
);

-- CreateTable
CREATE TABLE "CollectionImages" (
    "ImageId" SERIAL NOT NULL,
    "ImageCollection" INTEGER NOT NULL,
    "ImageAnswers" INTEGER NOT NULL DEFAULT 0,
    "ImageIdentifier" VARCHAR(120) NOT NULL,
    "ImageDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionImages_pkey" PRIMARY KEY ("ImageId")
);

-- CreateTable
CREATE TABLE "Collections" (
    "CollectionId" SERIAL NOT NULL,
    "CollectionName" VARCHAR(150) NOT NULL,
    "CollectionDescription" VARCHAR(500) NOT NULL,
    "CollectionQuantity" INTEGER NOT NULL DEFAULT 0,
    "CollectionAnswers" INTEGER NOT NULL DEFAULT 0,
    "CollectionCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collections_pkey" PRIMARY KEY ("CollectionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Answers_AnswerId_key" ON "Answers"("AnswerId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionImages_ImageIdentifier_key" ON "CollectionImages"("ImageIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionImages_ImageId_key" ON "CollectionImages"("ImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Collections_CollectionId_key" ON "Collections"("CollectionId");

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_AnswerCollection_fkey" FOREIGN KEY ("AnswerCollection") REFERENCES "Collections"("CollectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_AnswerImage_fkey" FOREIGN KEY ("AnswerImage") REFERENCES "CollectionImages"("ImageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionImages" ADD CONSTRAINT "CollectionImages_ImageCollection_fkey" FOREIGN KEY ("ImageCollection") REFERENCES "Collections"("CollectionId") ON DELETE RESTRICT ON UPDATE CASCADE;
