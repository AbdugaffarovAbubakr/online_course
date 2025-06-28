# Online Course Management API - Postman Collection

Bu Postman collection Online Course Management System API'sini test qilish uchun to'liq va professional formatda tayyorlangan.

## 📋 Collection Tarkibi

### 🔐 Authentication
- **Register Admin** - Admin foydalanuvchisini ro'yxatdan o'tkazish
- **Register Teacher** - O'qituvchi foydalanuvchisini ro'yxatdan o'tkazish  
- **Register Student** - Talaba foydalanuvchisini ro'yxatdan o'tkazish
- **Login Admin** - Admin sifatida kirish va access token olish
- **Login Teacher** - O'qituvchi sifatida kirish va access token olish
- **Login Student** - Talaba sifatida kirish va access token olish
- **Refresh Token** - Access token'ni yangilash

### 👥 Users (Admin Only)
- **Get All Users** - Barcha foydalanuvchilarni olish
- **Get User by ID** - ID bo'yicha foydalanuvchini olish
- **Update User** - Foydalanuvchi ma'lumotlarini yangilash
- **Delete User** - Foydalanuvchini o'chirish

### 📚 Courses
- **Get All Courses** - Barcha kurslarni olish
- **Get Course by ID** - ID bo'yicha kurs ma'lumotlarini olish
- **Create Course** - Yangi kurs yaratish va o'qituvchiga tayinlash (Admin only)
- **Get Assigned Courses** - O'qituvchiga tayinlangan kurslarni olish
- **Update Course** - Kurs ma'lumotlarini yangilash (Admin yoki tayinlangan o'qituvchi)
- **Delete Course** - Kursni o'chirish (Admin only)

### 🎓 Enrollment
- **Get All Enrollments** - Barcha ro'yxatdan o'tishlarni olish (Admin/Teacher)
- **Get My Courses** - Joriy talabaning kurslarini olish
- **Get Enrollments by Course** - Kurs bo'yicha ro'yxatdan o'tishlarni olish (Admin/Teacher)
- **Enroll in Course** - Kursga ro'yxatdan o'tish
- **Unenroll from Course** - Kursdan chiqish

### 📖 Modules
- **Get All Modules** - Barcha modullarni olish
- **Get Module by ID** - ID bo'yicha modul ma'lumotlarini olish
- **Get Modules by Course** - Kurs bo'yicha modullarni olish
- **Create Module** - Yangi modul yaratish (Admin/Teacher)
- **Update Module** - Modul ma'lumotlarini yangilash (Admin/Teacher)
- **Delete Module** - Modulni o'chirish (Admin only)

### 📝 Lessons
- **Get All Lessons** - Barcha darslarni olish
- **Get Lesson by ID** - ID bo'yicha dars ma'lumotlarini olish
- **Get Lessons by Module** - Modul bo'yicha darslarni olish
- **Create Lesson** - Yangi dars yaratish (Admin/Teacher)
- **Update Lesson** - Dars ma'lumotlarini yangilash (Admin/Teacher)
- **Delete Lesson** - Darsni o'chirish (Admin only)

### 📋 Assignments
- **Get All Assignments** - Barcha topshiriqlarni olish (Admin/Teacher)
- **Get Assignment by ID** - ID bo'yicha topshiriq ma'lumotlarini olish (Admin/Teacher)
- **Get Assignments by Module** - Modul bo'yicha topshiriqlarni olish (Admin/Teacher)
- **Get My Assignments** - Joriy talabaning topshiriqlarini olish
- **Submit Assignment** - Topshiriqni topshirish
- **Grade Assignment** - Topshiriqni baholash (Admin/Teacher)

### 📊 Results
- **Get My Results** - Joriy talabaning natijalarini olish
- **Get Results by Course** - Kurs bo'yicha natijalarni olish (Admin/Teacher)
- **Get Results by Student ID** - Talaba ID bo'yicha natijalarni olish (Admin/Teacher)

## 🚀 Foydalanish Ko'rsatmalari

### 1. Environment Variables O'rnatish
Postman'da yangi environment yarating va quyidagi o'zgaruvchilarni qo'shing:

```
baseUrl: http://localhost:3000
accessToken: (login qilgandan keyin to'ldiriladi)
```

### 2. Authentication
1. Avval **Register Admin** yoki **Register Teacher** yoki **Register Student** endpoint'ini ishlatib foydalanuvchi yarating
2. **Login Admin/Teacher/Student** endpoint'ini ishlatib tizimga kiring
3. Response'dan `accessToken`'ni oling va environment'da `accessToken` o'zgaruvchisiga saqlang

### 3. API Test Qilish
- Har bir endpoint uchun kerakli role'ga ega foydalanuvchi bilan login qiling
- `accessToken` avtomatik ravishda Authorization header'da ishlatiladi
- Endpoint'lar role-based access control bilan himoyalangan

## 🔐 Role-Based Access Control

### Admin Role
- Barcha endpoint'larni ishlatish huquqiga ega
- Foydalanuvchilarni boshqarish
- Kurslarni yaratish va o'qituvchilarga tayinlash
- Barcha ma'lumotlarni ko'rish va boshqarish

### Teacher Role
- O'ziga tayinlangan kurslarni boshqarish
- Modullar va darslarni yaratish/yangilash
- Topshiriqlarni baholash
- O'z kurslaridagi talabalarni ko'rish

### Student Role
- Kurslarga ro'yxatdan o'tish
- O'z kurslarini ko'rish
- Topshiriqlarni topshirish
- O'z natijalarini ko'rish

## 📝 Muhim Eslatmalar

1. **Course Creation**: Faqat admin'lar kurs yaratishi va o'qituvchilarga tayinlashi mumkin
2. **Teacher Assignment**: Kurs yaratishda `teacherId` majburiy maydon
3. **Grading**: O'qituvchilar barcha kurslardagi topshiriqlarni baholay oladi
4. **Token Management**: Access token'lar 1 soat amal qiladi, refresh token orqali yangilash mumkin

## 🛠️ API Endpoints

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints
```
POST /auth/register - Foydalanuvchi ro'yxatdan o'tkazish
POST /auth/login - Tizimga kirish
POST /auth/refresh - Token yangilash
```

### Users Endpoints (Admin Only)
```
GET /users - Barcha foydalanuvchilar
GET /users/:id - Foydalanuvchi ma'lumotlari
PUT /users/:id - Foydalanuvchi yangilash
DELETE /users/:id - Foydalanuvchi o'chirish
```

### Courses Endpoints
```
GET /courses - Barcha kurslar
GET /courses/:id - Kurs ma'lumotlari
POST /courses - Kurs yaratish (Admin only)
GET /courses/teacher/assigned - O'qituvchiga tayinlangan kurslar
PUT /courses/:id - Kurs yangilash
DELETE /courses/:id - Kurs o'chirish (Admin only)
```

### Enrollment Endpoints
```
GET /enrollment - Barcha ro'yxatdan o'tishlar (Admin/Teacher)
GET /enrollment/my-courses - Mening kurslarim
GET /enrollment/course/:id - Kurs bo'yicha ro'yxatdan o'tishlar
POST /enrollment - Kursga ro'yxatdan o'tish
DELETE /enrollment/:id - Kursdan chiqish
```

### Modules Endpoints
```
GET /modules - Barcha modullar
GET /modules/:id - Modul ma'lumotlari
GET /modules/course/:id - Kurs bo'yicha modullar
POST /modules - Modul yaratish (Admin/Teacher)
PUT /modules/:id - Modul yangilash (Admin/Teacher)
DELETE /modules/:id - Modul o'chirish (Admin only)
```

### Lessons Endpoints
```
GET /lessons - Barcha darslar
GET /lessons/:id - Dars ma'lumotlari
GET /lessons/module/:id - Modul bo'yicha darslar
POST /lessons - Dars yaratish (Admin/Teacher)
PUT /lessons/:id - Dars yangilash (Admin/Teacher)
DELETE /lessons/:id - Dars o'chirish (Admin only)
```

### Assignments Endpoints
```
GET /assignments - Barcha topshiriqlar (Admin/Teacher)
GET /assignments/:id - Topshiriq ma'lumotlari (Admin/Teacher)
GET /assignments/module/:id - Modul bo'yicha topshiriqlar (Admin/Teacher)
GET /assignments/student/me - Mening topshiriqlarim
POST /assignments/module/:id - Topshiriq topshirish
PUT /assignments/:id/grade - Topshiriq baholash (Admin/Teacher)
```

### Results Endpoints
```
GET /results - Mening natijalarim
GET /results/course/:id - Kurs bo'yicha natijalar (Admin/Teacher)
GET /results/student/:id - Talaba natijalari (Admin/Teacher)
```

## 📞 Yordam

Agar biror muammo yuzaga kelsa yoki qo'shimcha savollaringiz bo'lsa, iltimos bog'laning. 