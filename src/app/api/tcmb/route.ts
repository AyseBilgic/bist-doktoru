/**
 * BIST Doktoru - TCMB Döviz Kuru API Route
 * Türkiye Cumhuriyet Merkez Bankası resmi döviz kurlarını çeker
 * 
 * TCMB XML Servisi: https://www.tcmb.gov.tr/kurlar/today.xml
 * Güncelleme: Her iş günü ~15:30'da güncellenir
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache (Next.js serverless ortamında sınırlı ömürlü)
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 dakika

interface TCMBRate {
  code: string;
  name: string;
  buying: number;
  selling: number;
  effectiveBuying: number;
  effectiveSelling: number;
  unit: number;
  date: string;
}

/**
 * TCMB XML verisini parse eder
 */
function parseTCMBXML(xmlText: string): TCMBRate[] {
  const rates: TCMBRate[] = [];

  // Tarih bilgisini al
  const dateMatch = xmlText.match(/Date="([^"]+)"/);
  const date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString("tr-TR");

  // Her Currency bloğunu parse et
  const currencyRegex = /<Currency[^>]*CrossOrder="(\d+)"[^>]*Kod="([A-Z]+)"[^>]*>([\s\S]*?)<\/Currency>/g;
  let match;

  while ((match = currencyRegex.exec(xmlText)) !== null) {
    const code = match[2];
    const block = match[3];

    // İsim
    const nameMatch = block.match(/<Isim>([^<]+)<\/Isim>/);
    const name = nameMatch ? nameMatch[1].trim() : code;

    // Unit (birim)
    const unitMatch = block.match(/<Unit>(\d+)<\/Unit>/);
    const unit = unitMatch ? parseInt(unitMatch[1]) : 1;

    // Alış kuru
    const buyingMatch = block.match(/<ForexBuying>([^<]+)<\/ForexBuying>/);
    const buying = buyingMatch && buyingMatch[1].trim() !== "" ? parseFloat(buyingMatch[1]) : 0;

    // Satış kuru
    const sellingMatch = block.match(/<ForexSelling>([^<]+)<\/ForexSelling>/);
    const selling = sellingMatch && sellingMatch[1].trim() !== "" ? parseFloat(sellingMatch[1]) : 0;

    // Efektif alış
    const effBuyingMatch = block.match(/<BanknoteBuying>([^<]+)<\/BanknoteBuying>/);
    const effectiveBuying = effBuyingMatch && effBuyingMatch[1].trim() !== "" ? parseFloat(effBuyingMatch[1]) : buying;

    // Efektif satış
    const effSellingMatch = block.match(/<BanknoteSelling>([^<]+)<\/BanknoteSelling>/);
    const effectiveSelling = effSellingMatch && effSellingMatch[1].trim() !== "" ? parseFloat(effSellingMatch[1]) : selling;

    if (buying > 0 || selling > 0) {
      rates.push({
        code,
        name,
        buying,
        selling,
        effectiveBuying,
        effectiveSelling,
        unit,
        date,
      });
    }
  }

  return rates;
}

/**
 * Fallback veriler - TCMB erişilemez olduğunda kullanılır
 */
function getFallbackRates(): TCMBRate[] {
  const today = new Date().toLocaleDateString("tr-TR");
  return [
    { code: "USD", name: "ABD Doları", buying: 38.4012, selling: 38.4548, effectiveBuying: 38.3490, effectiveSelling: 38.5070, unit: 1, date: today },
    { code: "EUR", name: "Euro", buying: 41.8234, selling: 41.8812, effectiveBuying: 41.7657, effectiveSelling: 41.9389, unit: 1, date: today },
    { code: "GBP", name: "İngiliz Sterlini", buying: 49.1234, selling: 49.2012, effectiveBuying: 49.0657, effectiveSelling: 49.2589, unit: 1, date: today },
    { code: "CHF", name: "İsviçre Frangı", buying: 43.2134, selling: 43.2812, effectiveBuying: 43.1557, effectiveSelling: 43.3389, unit: 1, date: today },
    { code: "JPY", name: "Japon Yeni", buying: 0.2534, selling: 0.2548, effectiveBuying: 0.2527, effectiveSelling: 0.2555, unit: 100, date: today },
    { code: "SAR", name: "Suudi Arabistan Riyali", buying: 10.2234, selling: 10.2812, effectiveBuying: 10.1957, effectiveSelling: 10.3089, unit: 1, date: today },
    { code: "AUD", name: "Avustralya Doları", buying: 24.1234, selling: 24.1812, effectiveBuying: 24.0657, effectiveSelling: 24.2389, unit: 1, date: today },
    { code: "CAD", name: "Kanada Doları", buying: 27.3234, selling: 27.3812, effectiveBuying: 27.2657, effectiveSelling: 27.4389, unit: 1, date: today },
    { code: "NOK", name: "Norveç Kronu", buying: 3.4234, selling: 3.4312, effectiveBuying: 3.4157, effectiveSelling: 3.4389, unit: 1, date: today },
    { code: "SEK", name: "İsveç Kronu", buying: 3.5234, selling: 3.5312, effectiveBuying: 3.5157, effectiveSelling: 3.5389, unit: 1, date: today },
    { code: "DKK", name: "Danimarka Kronu", buying: 5.6034, selling: 5.6112, effectiveBuying: 5.5957, effectiveSelling: 5.6189, unit: 1, date: today },
    { code: "KWD", name: "Kuveyt Dinarı", buying: 124.5234, selling: 124.6812, effectiveBuying: 124.4657, effectiveSelling: 124.7389, unit: 1, date: today },
    { code: "CNY", name: "Çin Yuanı", buying: 5.2834, selling: 5.2912, effectiveBuying: 5.2757, effectiveSelling: 5.2989, unit: 1, date: today },
    { code: "PKR", name: "Pakistan Rupisi", buying: 0.1374, selling: 0.1382, effectiveBuying: 0.1367, effectiveSelling: 0.1389, unit: 1, date: today },
    { code: "QAR", name: "Katar Riyali", buying: 10.5534, selling: 10.5612, effectiveBuying: 10.5457, effectiveSelling: 10.5689, unit: 1, date: today },
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";

  // Cache kontrolü
  if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({
      ...(cache.data as object),
      cached: true,
      cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000),
    });
  }

  try {
    // TCMB XML servisine istek at
    const tcmbUrl = "https://www.tcmb.gov.tr/kurlar/today.xml";
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

    const response = await fetch(tcmbUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BIST-Doktoru/1.0)",
        "Accept": "text/xml, application/xml, */*",
      },
      next: { revalidate: 900 }, // Next.js ISR: 15 dakika
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`TCMB HTTP error: ${response.status}`);
    }

    // XML içeriğini al - TCMB ISO-8859-9 (Latin-5) encoding kullanır
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder("iso-8859-9");
    const xmlText = decoder.decode(buffer);

    // XML'i parse et
    const rates = parseTCMBXML(xmlText);

    if (rates.length === 0) {
      throw new Error("TCMB XML parse edilemedi veya boş veri döndü");
    }

    const responseData = {
      rates,
      date: rates[0]?.date || new Date().toLocaleDateString("tr-TR"),
      source: "TCMB (Türkiye Cumhuriyet Merkez Bankası)",
      url: tcmbUrl,
      count: rates.length,
      timestamp: new Date().toISOString(),
      cached: false,
    };

    // Cache'e kaydet
    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("[TCMB API Error]:", errorMessage);

    // Fallback verilerle yanıt ver
    const fallbackRates = getFallbackRates();
    const fallbackData = {
      rates: fallbackRates,
      date: new Date().toLocaleDateString("tr-TR"),
      source: "TCMB (Fallback - Tahmini Veriler)",
      count: fallbackRates.length,
      timestamp: new Date().toISOString(),
      cached: false,
      error: errorMessage,
      fallback: true,
      note: "TCMB servisine erişilemedi, tahmini veriler gösteriliyor",
    };

    return NextResponse.json(fallbackData, {
      status: 200, // Fallback olsa da 200 döndür, UI'da gösterilsin
      headers: {
        "X-Fallback": "true",
        "X-Error": errorMessage,
      },
    });
  }
}
