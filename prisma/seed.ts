import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding...')

  // Create Agenda 1
  const agenda1 = await prisma.agenda.create({
    data: {
      id: 1,
      name: 'သီချင်းဆို အစီစဥ်',
      sortOrder: 1,
      events: {
        create: [
          {
            name: 'သီချင်းနာမည် မသိရသေး',
            description: 'Kay Khine Thin\n(Production)',
            sortOrder: 1,
          },
          {
            name: 'ဂျင်းဘောင်းဘီ',
            description: 'Nang Phyu Phyu Soe\n(Admin)',
            sortOrder: 2,
          },
          {
            name: 'မဖွနဲ့',
            description: 'Su Wai Phyo\n(IT)',
            sortOrder: 3,
          },
          {
            name: 'သီချင်းနာမည် မသိရသေး',
            description: 'Hein Htut\n(Developer Sales)',
            sortOrder: 4,
          },
          {
            name: 'သီချင်းနာမည် မသိရသေး',
            description: 'Zinni Wint War\n(Developer Sales)',
            sortOrder: 5,
          },
          {
            name: 'သီချင်းနာမည် မသိရသေး',
            description: 'Lin Lat\n(Marketing)',
            sortOrder: 6,
          },
          {
            name: 'အလကားပဲ',
            description: 'Zin Zin\n(Agency)',
            sortOrder: 7,
          },
          {
            name: 'ဒါဟာအချစ်လား',
            description: 'Saung Wit Yee\n(Marketing)',
            sortOrder: 8,
          },
          {
            name: 'သီချင်းနာမည် မသိရသေး',
            description: 'Min Thant Ko Ko\n(Developer Sales)',
            sortOrder: 9,
          },
          {
            name: 'ပင်စီ',
            description: 'Eaindray\n(Marketing)',
            sortOrder: 10,
          },
        ],
      },
    },
  })

  // Create Agenda 2
  const agenda2 = await prisma.agenda.create({
    data: {
      id: 2,
      name: 'ပြဇတ် အစီစဥ်',
      description: 'ပထမဆု - 500,000\nဒုတိယဆု - 200,000\nတတိယဆု - 100,000\n\n* ပြဇာတ်ကပြရမည့်အချိန်က - ၅မိနစ်မို့ ၅မိနစ်အတွင်း ၅သိန်းရမယ့်အခွင့်အရေးလေးကို အမိအရဆုပ်ကိုင်ကြပါနော်',
      sortOrder: 2,
      events: {
        create: [
          {
            name: 'ရန်ကုန်အထာ\n(IT Team)',
            description: '1. Aung Khant Zaw\n2. Min Naing Thu\n3. Phyo Thiha\n4. Su Wai Phyo\n5. Nang Kahlar Hlaing\n6. Lin Htet Zaw\n7. Hnin Htet Aung\n8. Nang Sheng Hnin Oo',
            sortOrder: 1,
          },
          {
            name: 'ကျောနပ်ရင် အထာသိတယ်\n(Digital Marketing Team)',
            description: '1. Win Min Thwin\n2. Lin Let\n3. Thar Thar\n4. Aung Naing Htun',
            sortOrder: 2,
          },
          {
            name: 'ဘာလာလာဒေါင်း star\n(Production + Agency Sales Team)',
            description: '1. Saung Wit Yee\n2. Nai Wanna\n3. Kay Khine Thin\n4. Aye Chan Paing\n5. Kyaw Swar Min Htike\n6. Zin Zin Mar',
            sortOrder: 3,
          },
          {
            name: 'iMM, CarsDB Team',
            description: '1. Moe Kaung Khant\n2. Su Myat\n3. Nu Wah\n4. Mon Yee\n5. Min Thuta\n6. Kyaw Thiha',
            sortOrder: 4,
          },
          {
            name: 'Developer Sales Team',
            description: null,
            sortOrder: 5,
          },
        ],
      },
    },
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
