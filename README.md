# PhoneHub — Daftar HP Terbaru per Brand

Next.js 15 (App Router) + Tailwind CSS v4, disusun dengan **Clean Architecture**.
Data dari API open source **[Phone Specs API](https://github.com/azharimm/phone-specs-api)** (sumber GSMArena).

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # produksi
```

## Arsitektur

```
app/                         ← Framework layer (routing Next.js, controller tipis)
src/
├── domain/                  ← Inti bisnis, tanpa dependensi luar
│   ├── entities/            Brand, PhoneSummary, PhoneDetail, BrandCatalog
│   ├── repositories/        Port/interface: BrandRepository, PhoneRepository
│   └── services/            Aturan murni: searchPhones, phoneSeries, NEW_BADGE_COUNT
├── application/
│   └── use-cases/           GetFeaturedCatalogs, GetAllBrandPhones, GetPhoneDetail
├── infrastructure/          ← Adapter (implementasi port)
│   ├── http/                FetchHttpClient (cache ISR + timeout)
│   ├── phone-specs-api/     DTO, mapper DTO→entitas, PhoneSpecsApiRepository
│   ├── fallback/            FallbackPhoneRepository (data cadangan)
│   ├── repositories/        ResilientPhoneRepository (decorator primary → fallback)
│   └── brands/              StaticBrandRepository (5 brand + slug API)
├── di/container.ts          ← Composition root (merakit semua dependensi)
└── presentation/components/ ← UI React: PhoneExplorer, BrandCard, PhoneCard, ...
```

**Aturan dependensi:** `presentation → application → domain ← infrastructure`.
Domain tidak mengimpor apa pun dari luar; hanya `di/container.ts` yang mengenal kelas konkret.

### Contoh mengganti sumber data
Buat kelas baru yang `implements PhoneRepository` (mis. dari database sendiri),
lalu tukar di `src/di/container.ts`. Use case dan UI tidak perlu diubah.

### Menambah brand
Tambahkan ke `FEATURED_BRANDS` dan `brandApiSlugs` di
`src/infrastructure/brands/StaticBrandRepository.ts`
(slug ada di `https://phone-specs-api.vercel.app/brands`).
Tambahkan juga aturan series-nya (A Series, S Series, dst.) di
`SERIES_BY_BRAND` pada `src/domain/services/phoneSeries.ts`.

Env opsional: `PHONE_API_BASE` untuk URL API lain (mis. self-host).

Halaman pertama tiap brand dirender di server. Saat brand dibuka, klien mengambil
**semua** halaman API brand itu (use case `GetAllBrandPhones`, maks. 30 halaman, 5 request
paralel) lalu menggabungkannya. Filter series, pencarian, dan paging (24 HP per halaman)
berjalan di klien atas data lengkap tersebut.
