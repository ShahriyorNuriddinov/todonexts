# Vazifalar Ro'yxati (To-Do List)

Next.js va MockAPI bilan yaratilgan to-do list ilovasi.

## Xususiyatlar

- ✅ Foydalanuvchi tizimi (localStorage)
- ✅ Vazifa qo'shish, tahrirlash, o'chirish
- ✅ Har bir foydalanuvchi faqat o'z vazifalarini boshqaradi
- ✅ MockAPI backend integratsiyasi
- ✅ Dark mode qo'llab-quvvatlash

## Local'da ishga tushirish

```bash
npm install
npm run dev
```

## Vercel'ga deploy qilish

1. Vercel'ga kirish: https://vercel.com
2. GitHub repository'ni ulash
3. Environment Variables qo'shish:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://6905b069ee3d0d14c13361c0.mockapi.io/product`
4. Deploy tugmasini bosing

Yoki Vercel CLI orqali:

```bash
npm install -g vercel
vercel
```

## Environment Variables

`.env.local` faylida yoki Vercel dashboard'da quyidagi o'zgaruvchini sozlang:

```
NEXT_PUBLIC_API_URL=https://6905b069ee3d0d14c13361c0.mockapi.io/product
```

## Texnologiyalar

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MockAPI
