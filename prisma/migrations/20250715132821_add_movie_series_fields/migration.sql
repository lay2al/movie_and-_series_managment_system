-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "cast" TEXT[],
ADD COLUMN     "director" TEXT,
ADD COLUMN     "duration" INTEGER;

-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "cast" TEXT[],
ADD COLUMN     "creator" TEXT,
ADD COLUMN     "numberOfEpisodes" INTEGER;
