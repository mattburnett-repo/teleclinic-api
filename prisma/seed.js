import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create test doctors
  await prisma.doctor.create({
    data: {
      name: 'Dr. Sarah Wilson',
      speciality: 'Neurology',
      availability: [
        '2024-03-21T09:00:00Z',
        '2024-03-21T10:00:00Z',
        '2024-03-21T14:00:00Z',
      ],
      imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 4.8,
      experience: 12
    }
  });

  await prisma.doctor.create({
    data: {
      name: 'Dr. Robert Martinez',
      speciality: 'Neurology',
      availability: [
        '2024-03-21T12:00:00Z',
        '2024-03-21T16:00:00Z',
      ],
      imageUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
      rating: 4.7,
      experience: 8
    }
  });

  await prisma.doctor.create({
    data: {
      name: 'Dr. James Rodriguez',
      speciality: 'Orthopedics',
      availability: [
        '2024-03-21T09:30:00Z',
        '2024-03-21T11:30:00Z',
      ],
      imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 4.9,
      experience: 15
    }
  });

  await prisma.doctor.create({
    data: {
      name: 'Dr. David Kim',
      speciality: 'Internal Medicine',
      availability: [
        '2024-03-21T10:30:00Z',
        '2024-03-21T14:30:00Z',
      ],
      imageUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
      rating: 4.6,
      experience: 10
    }
  });

  await prisma.doctor.create({
    data: {
      name: 'Dr. John Murphy',
      speciality: 'Internal Medicine',
      availability: [
        '2024-03-21T09:00:00Z',
        '2024-03-21T13:00:00Z',
      ],
      imageUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
      rating: 4.8,
      experience: 11
    }
  });

  await prisma.doctor.create({
    data: {
      name: 'Dr. Maria Garcia',
      speciality: 'Internal Medicine',
      availability: [
        '2024-03-21T11:00:00Z',
        '2024-03-21T15:00:00Z',
      ],
      imageUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 4.9,
      experience: 13
    }
  });

  await prisma.doctor.create({
    data: {
      name: 'Dr. Rachel Green',
      speciality: 'Psychiatry',
      availability: [
        '2024-03-21T11:00:00Z',
        '2024-03-21T15:00:00Z',
      ],
      imageUrl: 'https://randomuser.me/api/portraits/women/95.jpg',
      rating: 4.9,
      experience: 13
    }
  });

  await prisma.doctor.create({
    data: {
      name: 'Dr. Marcus Webb',
      speciality: 'Psychiatry',
      availability: [
        '2024-03-21T13:00:00Z',
        '2024-03-21T16:00:00Z',
      ],
      imageUrl: 'https://randomuser.me/api/portraits/men/86.jpg',
      rating: 4.7,
      experience: 9
    }
  });

  // Create test inquiry
  await prisma.healthInquiry.create({
    data: {
      patientName: 'Anna Mueller',
      symptoms: 'Headache',
      status: 'pending'
    }
  });
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 