# 🎓 Online Course Management System

To'liq funksional online kurslar boshqaruvi tizimi. NestJS, PostgreSQL, TypeORM va JWT autentifikatsiya asosida qurilgan.

## 🚀 Loyiha haqida

Bu tizim o'quv markazlari, universitetlar va online ta'lim platformalari uchun mo'ljallangan. Tizimda 3 ta asosiy rol mavjud:

- **👨‍💼 Admin** - Tizimni to'liq boshqaradi
- **👨‍🏫 Teacher** - Kurslar yaratadi va talabalarni baholaydi  
- **👨‍🎓 Student** - Kurslarga yoziladi va vazifalarni bajaradi

## ✨ Asosiy imkoniyatlar

### 🔐 Xavfsizlik va Autentifikatsiya
- **JWT token** asosida autentifikatsiya
- **Access token** va **Refresh token** tizimi
- **Role-based access control (RBAC)** - har bir rol uchun alohida huquqlar
- **Password hashing** - parollar xavfsiz saqlanadi
- **Token yangilash** - avtomatik token yangilash

### 👥 Foydalanuvchilar boshqaruvi
- **Ro'yxatdan o'tish** - yangi foydalanuvchilar qo'shish
- **Profil ma'lumotlari** - foydalanuvchi ma'lumotlarini ko'rish va yangilash
- **Rol boshqaruvi** - admin, teacher, student rollari
- **Foydalanuvchilarni o'chirish** - admin tomonidan

### 📚 Kurslar boshqaruvi
- **Kurs yaratish** - yangi kurslar qo'shish
- **Kurs ma'lumotlari** - batafsil kurs tavsifi
- **Kurs kategoriyalari** - dasturlash, dizayn, marketing va boshqalar
- **Kurs darajalari** - boshlang'ich, o'rta, yuqori
- **Kurs narxi** - to'lov tizimi uchun
- **Kurs davomiyligi** - soatlar hisobida
- **Kurs rasmlari** - vizual ko'rsatish uchun

### 📖 Modullar va darslar
- **Modullar** - kurs ichidagi asosiy bo'limlar
- **Darslar** - har bir modul ichidagi aniq darslar
- **Dars tartibi** - modullar va darslar ketma-ketligi
- **Video darslar** - video materiallar qo'shish
- **Dars davomiyligi** - har bir dars uchun vaqt

### 🎯 Vazifalar va baholash
- **Vazifa yuklash** - talabalar vazifalarini yuklaydi
- **Fayl yuklash** - PDF, DOC, ZIP va boshqa formatlar
- **Baho berish** - o'qituvchilar vazifalarni baholaydi
- **Baho tizimi** - 0-100 ball tizimi
- **Izohlar** - o'qituvchi izohlari

### 📊 Natijalar va hisobotlar
- **Talaba natijalari** - har bir talaba natijalari
- **Kurs natijalari** - butun kurs bo'yicha natijalar
- **O'rtacha ball** - avtomatik hisoblash
- **Progress tracking** - o'qish jarayonini kuzatish

### 📋 Kurslarga yozilish
- **Kursga yozilish** - talabalar kurslarga yoziladi
- **Yozilishlar ro'yxati** - barcha yozilishlar
- **Kursdan chiqish** - talaba kursdan chiqishi mumkin
- **Yozilish sanasi** - avtomatik sana qo'shish

## 🛠 Texnik xususiyatlar

### Backend texnologiyalari
- **NestJS** - Node.js framework
- **TypeScript** - type-safe dasturlash
- **PostgreSQL** - asosiy ma'lumotlar bazasi
- **TypeORM** - ORM va ma'lumotlar bazasi boshqaruvi
- **JWT** - autentifikatsiya va avtorizatsiya
- **Class-validator** - ma'lumotlar validatsiyasi
- **Class-transformer** - ma'lumotlar transformatsiyasi

### Xavfsizlik
- **JWT Guards** - endpointlarni himoya qilish
- **Role Guards** - rollar asosida ruxsat berish
- **Validation Pipes** - kiruvchi ma'lumotlarni tekshirish
- **Exception Filters** - xatolarni boshqarish
- **Logging Interceptors** - tizim loglarini saqlash

### Ma'lumotlar bazasi
- **Entity Relationships** - jadvallar o'rtasida bog'lanish
- **Migrations** - ma'lumotlar bazasi o'zgarishlari
- **Indexes** - tezlik optimizatsiyasi
- **Foreign Keys** - ma'lumotlar yaxlitligi

## 🚀 O'rnatish va ishga tushirish

### Talablar
- Node.js 18+ 
- PostgreSQL 12+
- Docker (ixtiyoriy)

### 1. Loyihani yuklab olish
```bash
git clone <repository-url>
cd online-course-management
```

### 2. Dependencies o'rnatish
```bash
npm install
```

### 3. Environment variables sozlash
`.env` faylini yarating:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=course_management

# JWT
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development
```

### 4. Ma'lumotlar bazasini sozlash
```bash
# PostgreSQL o'rnatish va ma'lumotlar bazasini yaratish
createdb course_management
```

### 5. Docker bilan ishga tushirish (tavsiya etiladi)
```bash
# PostgreSQL va NestJS app ishga tushirish
docker-compose up -d

# Faqat PostgreSQL
docker-compose up -d postgres
```

### 6. Loyihani ishga tushirish
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📡 API Endpointlar

### 🔐 Autentifikatsiya
```
POST /auth/register     - Ro'yxatdan o'tish
POST /auth/login        - Tizimga kirish
POST /auth/refresh      - Token yangilash
```

### 👥 Foydalanuvchilar
```
GET    /users           - Barcha foydalanuvchilar (Admin)
GET    /users/:id       - Foydalanuvchi ma'lumotlari (Admin)
PUT    /users/:id       - Foydalanuvchi yangilash (Admin)
DELETE /users/:id       - Foydalanuvchi o'chirish (Admin)
```

### 📚 Kurslar
```
GET    /courses         - Barcha kurslar
GET    /courses/:id     - Kurs ma'lumotlari
POST   /courses         - Yangi kurs yaratish (Admin/Teacher)
PUT    /courses/:id     - Kursni tahrirlash (Admin/Teacher)
DELETE /courses/:id     - Kursni o'chirish (Admin)
```

### 📖 Modullar
```
GET    /modules         - Barcha modullar
GET    /modules/course/:courseId  - Kurs modullari
GET    /modules/:id     - Modul ma'lumotlari
POST   /modules         - Yangi modul yaratish (Admin/Teacher)
PUT    /modules/:id     - Modulni tahrirlash (Admin/Teacher)
DELETE /modules/:id     - Modulni o'chirish (Admin)
```

### 📝 Darslar
```
GET    /lessons         - Barcha darslar
GET    /lessons/module/:moduleId  - Modul darslari
GET    /lessons/:id     - Dars ma'lumotlari
POST   /lessons         - Yangi dars yaratish (Admin/Teacher)
PUT    /lessons/:id     - Darsni tahrirlash (Admin/Teacher)
DELETE /lessons/:id     - Darsni o'chirish (Admin)
```

### 🎯 Vazifalar
```
GET    /assignments     - Barcha vazifalar
GET    /assignments/:id - Vazifa ma'lumotlari
POST   /assignments     - Vazifa yuklash (Student)
PUT    /assignments/:id/grade  - Vazifani baholash (Teacher)
```

### 📊 Natijalar
```
GET    /results         - Talaba natijalari (Student)
GET    /results/course/:courseId  - Kurs natijalari (Admin/Teacher)
GET    /results/student/:studentId  - Talaba natijalari (Admin/Teacher)
```

### 📋 Kurslarga yozilish
```
GET    /enrollment      - Barcha yozilishlar (Admin/Teacher)
POST   /enrollment      - Kursga yozilish (Student)
DELETE /enrollment/:id  - Kursdan chiqish (Student)
```

## 🔒 Xavfsizlik va Ruxsatlar

### Admin huquqlari:
- ✅ Barcha foydalanuvchilarni boshqarish
- ✅ Barcha kurslarni yaratish va o'chirish
- ✅ Tizim sozlamalarini o'zgartirish
- ✅ Barcha ma'lumotlarni ko'rish

### O'qituvchi huquqlari:
- ✅ O'z kurslarini yaratish va tahrirlash
- ✅ Modullar va darslar qo'shish
- ✅ Vazifalarni baholash
- ✅ O'z kurslari natijalarini ko'rish
- ❌ Boshqa o'qituvchilar kurslarini o'zgartirish

### Talaba huquqlari:
- ✅ Kurslarga yozilish
- ✅ Darslarni ko'rish
- ✅ Vazifalarni yuklash
- ✅ O'z natijalarini ko'rish
- ❌ Kurslarni o'zgartirish

## 🧪 API Testlash

### Postman Collection
Loyiha bilan birga `Online_Course_Management_API.postman_collection.json` fayli keladi.

### Testlash tartibi:
1. **Postman oching** va collection import qiling
2. **Environment variables** o'rnating:
   - `base_url`: `http://localhost:3000`
   - `user_email`: test foydalanuvchi email
   - `user_password`: test foydalanuvchi paroli
3. **Test senariylarini** bajaring

### Asosiy test senariylari:
1. **Ro'yxatdan o'tish** - Yangi foydalanuvchi yarating
2. **Tizimga kirish** - Token oling
3. **Kurs yaratish** - Admin/Teacher roli bilan
4. **Modul qo'shish** - Kursga modul qo'shing
5. **Dars qo'shish** - Modulga dars qo'shing
6. **Kursga yozilish** - Student roli bilan
7. **Vazifa yuklash** - Student roli bilan
8. **Vazifani baholash** - Teacher roli bilan
9. **Natijalarni ko'rish** - Barcha rollar uchun

## 📁 Loyiha strukturasi

```
src/
├── auth/                 # Autentifikatsiya
│   ├── guards/          # JWT va Role guards
│   ├── strategies/      # JWT strategy
│   ├── decorators/      # Custom decorators
│   └── dto/            # Auth DTOs
├── users/               # Foydalanuvchilar
├── courses/             # Kurslar
├── modules/             # Modullar
├── lessons/             # Darslar
├── assignments/         # Vazifalar
├── results/             # Natijalar
├── enrollment/          # Kurslarga yozilish
└── common/              # Umumiy komponentlar
    ├── exceptions/      # Custom exceptions
    ├── filters/         # Exception filters
    └── interceptors/    # Logging interceptors
```

## 🚀 Keyingi qadamlar

### Qo'shimcha funksiyalar:
- [ ] **Fayl yuklash** - real fayl yuklash tizimi
- [ ] **Email xabarnomalar** - avtomatik xabarnomalar
- [ ] **To'lov tizimi** - kurslar uchun to'lov
- [ ] **Chat tizimi** - o'qituvchi va talaba o'rtasida
- [ ] **Video streaming** - dars videolarini ko'rish
- [ ] **Progress tracking** - o'qish jarayonini kuzatish
- [ ] **Certificate generation** - sertifikatlar yaratish
- [ ] **Analytics dashboard** - statistika va hisobotlar

### Texnik yaxshilanishlar:
- [ ] **Rate limiting** - API so'rovlarini cheklash
- [ ] **Caching** - Redis bilan keshlash
- [ ] **File upload** - Cloud storage integratsiyasi
- [ ] **Search functionality** - qidiruv tizimi
- [ ] **Pagination** - sahifalash
- [ ] **API documentation** - Swagger/OpenAPI
- [ ] **Unit tests** - testlar yozish
- [ ] **E2E tests** - end-to-end testlar

## 🤝 Hissa qo'shish

1. Repositoryni fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add amazing feature'`)
4. Branchga push qiling (`git push origin feature/amazing-feature`)
5. Pull Request yarating

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

## 📞 Aloqa

Savollar yoki takliflar uchun:
- Email: [abdugaffarovabubakr698@gmail.com]
- GitHub: [https://github.com/AbdugaffarovAbubakr]

---

**🎉 Online Course Management System** - Zamonaviy ta'lim platformasi! 🎓
