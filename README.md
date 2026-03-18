# BIST Doktoru — Next.js

**Türkiye'nin Kapsamlı Finans Platformu** — BIST Hisse Senetleri, Kripto Para ve Döviz Kurları

> Orijinal proje: [AyseBilgic/bist-doktoru](https://github.com/AyseBilgic/bist-doktoru) (React + Vite + Wouter)  
> Bu sürüm: **Next.js 14 App Router** ile yeniden yazılmış, TCMB + Binance + Collect API entegrasyonları eklenmiştir.

---

## Özellikler

| Özellik | Açıklama |
|---|---|
| **BIST Hisse Senetleri** | Collect API ile canlı veriler, TradingView grafikleri, sektör filtresi |
| **Kripto Para** | Binance Public API ile 15 kripto para, USD/TRY paritesi |
| **Döviz Kurları** | TCMB resmi XML servisi ile 22 döviz kuru |
| **Piyasa Analizi** | Sektör performansı, ekonomik takvim, ısı haritası |
| **Portföy Takip** | Hisse + kripto portföyü, kâr/zarar hesabı, pasta grafik |
| **Hesap Makinesi** | Kâr/zarar, hedef fiyat, lot hesaplama |

---

## API Entegrasyonları

### 1. TCMB API (`/api/tcmb`)
- **Kaynak:** Türkiye Cumhuriyet Merkez Bankası resmi XML servisi
- **URL:** `https://www.tcmb.gov.tr/kurlar/today.xml`
- **API Key:** Gerekmez (ücretsiz)
- **Güncelleme:** Her iş günü ~15:30
- **Cache:** 15 dakika
- **Fallback:** TCMB erişilemezse tahmini veriler döner

```bash
curl http://localhost:3000/api/tcmb
curl http://localhost:3000/api/tcmb?refresh=true  # Cache bypass
```

### 2. Binance API (`/api/binance`)
- **Kaynak:** Binance Public REST API v3
- **URL:** `https://api.binance.com/api/v3/ticker/24hr`
- **API Key:** Gerekmez (public endpoint)
- **Rate Limit:** 1200 istek/dakika (IP bazlı)
- **Cache:** 30 saniye
- **Özellik:** USD/TRY kuru Binance USDTTRY paritesinden alınır

```bash
curl http://localhost:3000/api/binance
curl http://localhost:3000/api/binance?symbol=BTCUSDT  # Tek sembol
curl http://localhost:3000/api/binance?refresh=true    # Cache bypass
```

### 3. Collect API (`/api/collect`)
- **Kaynak:** [collectapi.com](https://collectapi.com/tr/api/economy/ekonomi-ve-finans-api)
- **API Key:** `COLLECT_API_KEY` environment variable gerekli
- **Ücretsiz Plan:** 100 istek/gün
- **Cache:** 5 dakika
- **Fallback:** API key yoksa veya hata olursa statik veriler döner

```bash
curl http://localhost:3000/api/collect
curl http://localhost:3000/api/collect?symbol=THYAO  # Tek hisse
curl http://localhost:3000/api/collect?refresh=true  # Cache bypass
```

---

## Kurulum

### 1. Repoyu klonlayın

```bash
git clone https://github.com/AyseBilgic/bist-doktoru.git
cd bist-doktoru-next
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Environment variables ayarlayın

```bash
cp .env.local.example .env.local
# .env.local dosyasını düzenleyip COLLECT_API_KEY ekleyin
```

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## Proje Yapısı

```
src/
├── app/
│   ├── page.tsx              # Ana sayfa (TCMB + Binance widget'ları)
│   ├── bist/page.tsx         # BIST hisse senetleri
│   ├── kripto/page.tsx       # Kripto para piyasası
│   ├── doviz/page.tsx        # Döviz kurları (TCMB)
│   ├── analiz/page.tsx       # Piyasa analizi
│   ├── portfoy/page.tsx      # Portföy takip
│   ├── hakkimizda/page.tsx   # Hakkımızda
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global stiller
│   └── api/
│       ├── tcmb/route.ts     # TCMB döviz API
│       ├── binance/route.ts  # Binance kripto API
│       └── collect/route.ts  # Collect BIST API
├── components/
│   ├── Layout.tsx            # Sidebar + ticker strip
│   └── TradingViewWidget.tsx # TradingView widget wrapper
├── types/
│   └── index.ts              # TypeScript tipleri
└── lib/
    └── utils.ts              # Yardımcı fonksiyonlar
```

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + TailwindCSS v3 |
| Grafikler | TradingView Widgets |
| Portföy Grafik | Recharts |
| İkonlar | Lucide React |
| Toast | Sonner |
| Animasyon | Framer Motion |
| Tip Güvenliği | TypeScript |

---

## Orijinal Projeden Farklar

| Özellik | Orijinal (Vite) | Bu Sürüm (Next.js) |
|---|---|---|
| Router | Wouter | Next.js App Router |
| API | Express.js server | Next.js API Routes |
| TCMB | Yok | ✅ `/api/tcmb` |
| Binance | Yok | ✅ `/api/binance` |
| Collect API | Yok | ✅ `/api/collect` |
| Döviz Sayfası | Yok | ✅ `/doviz` |
| SSR/ISR | Yok | ✅ Next.js ISR |
| Cache | Yok | ✅ In-memory + ISR |

---

## Lisans

MIT License — © 2025 BIST Doktoru
