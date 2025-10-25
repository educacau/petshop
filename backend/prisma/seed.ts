import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

const hashPassword = async (plain: string) => bcrypt.hash(plain, 10);

const USERS = [
  {
    name: 'Admin Master',
    email: 'admin@petshop.com',
    role: 'ADMIN',
    password: 'Admin@123',
    phone: '+55 11 99999-0000'
  },
  {
    name: 'Maria Funcionária',
    email: 'maria.staff@petshop.com',
    role: 'STAFF',
    password: 'Staff@123',
    phone: '+55 11 98888-1111'
  },
  {
    name: 'João Cliente',
    email: 'joao.cliente@petshop.com',
    role: 'CUSTOMER',
    password: 'Cliente@123',
    phone: '+55 11 97777-2222'
  }
] as const;

type SeedUser = (typeof USERS)[number];

type UserRole = SeedUser['role'];

type ServiceType = 'BATH' | 'GROOMING' | 'BATH_GROOMING';
type ScheduleStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

const run = async () => {
  try {
    await prisma.schedule.deleteMany();
    await prisma.pet.deleteMany();
    await prisma.user.deleteMany();

    const createdUsers: Record<string, {id: string}> = {};

    for (const user of USERS) {
      const passwordHash = await hashPassword(user.password);
      createdUsers[user.email] = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          phone: user.phone,
          passwordHash
        }
      });
    }

    const joao = createdUsers['joao.cliente@petshop.com'];
    await prisma.businessSetting.upsert({
      where: {id: 'default-setting'},
      update: {},
      create: {
        id: 'default-setting',
        openingTime: 8,
        closingTime: 18,
        slotDuration: 60
      }
    });

    const maria = createdUsers['maria.staff@petshop.com'];

    const pet = await prisma.pet.create({
      data: {
        name: 'Rex',
        species: 'Cachorro',
        breed: 'Labrador',
        weight: 30,
        customerId: joao.id,
        medicalNotes: 'Alergia a alguns produtos.'
      }
    });

    await prisma.schedule.createMany({
      data: [
        {
          serviceType: 'BATH' as ServiceType,
          scheduledAt: dayjs().add(1, 'day').set('hour', 10).toDate(),
          status: 'SCHEDULED' as ScheduleStatus,
          customerId: joao.id,
          petId: pet.id,
          staffId: maria.id,
          price: 90
        },
        {
          serviceType: 'BATH_GROOMING' as ServiceType,
          scheduledAt: dayjs().subtract(2, 'day').set('hour', 14).toDate(),
          status: 'COMPLETED' as ScheduleStatus,
          customerId: joao.id,
          petId: pet.id,
          staffId: maria.id,
          price: 150
        }
      ]
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

run();
