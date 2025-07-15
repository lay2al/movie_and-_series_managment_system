import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@movies.com' },
    update: {},
    create: {
      email: 'admin@movies.com',
      password: hashedPassword,
      name: 'System Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', {
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  // Create a sample regular user
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@movies.com' },
    update: {},
    create: {
      email: 'user@movies.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER',
    },
  });

  console.log('✅ Regular user created:', {
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Create sample movies
  const movies = await Promise.all([
    prisma.movie.create({
      data: {
        title: 'The Matrix',
        releaseDate: new Date('1999-03-31'),
        genre: 'Sci-Fi',
        synopsis: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        director: 'The Wachowskis',
        cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
        duration: 136,
        rating: 8.7,
        poster: 'https://image.tmdb.org/t/p/w500/matrix.jpg',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Inception',
        releaseDate: new Date('2010-07-16'),
        genre: 'Sci-Fi',
        synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Elliot Page', 'Tom Hardy'],
        duration: 148,
        rating: 8.8,
        poster: 'https://image.tmdb.org/t/p/w500/inception.jpg',
      },
    }),
  ]);

  console.log('✅ Sample movies created:', movies.length);

  // Create sample series
  const series = await Promise.all([
    prisma.series.create({
      data: {
        title: 'Breaking Bad',
        startYear: 2008,
        endYear: 2013,
        genre: 'Drama',
        synopsis: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
        creator: 'Vince Gilligan',
        cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Dean Norris'],
        numberOfSeasons: 5,
        numberOfEpisodes: 62,
        rating: 9.5,
        poster: 'https://image.tmdb.org/t/p/w500/breaking-bad.jpg',
      },
    }),
    prisma.series.create({
      data: {
        title: 'Stranger Things',
        startYear: 2016,
        genre: 'Sci-Fi',
        synopsis: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
        creator: 'The Duffer Brothers',
        cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour', 'Winona Ryder'],
        numberOfSeasons: 4,
        numberOfEpisodes: 42,
        rating: 8.7,
        poster: 'https://image.tmdb.org/t/p/w500/stranger-things.jpg',
      },
    }),
  ]);

  console.log('✅ Sample series created:', series.length);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\nDefault credentials:');
  console.log('Admin: admin@movies.com / admin123');
  console.log('User: user@movies.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });