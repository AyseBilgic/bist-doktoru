export type TcmbRate = {
  code: string;
  name: string;
  unit: number;
  forexBuying: string;
  forexSelling: string;
  banknoteBuying: string;
  banknoteSelling: string;
};

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) return null;
    return json.result as T;
  } catch {
    return null;
  }
}

export const fetchTcmbRates = () => apiFetch<TcmbRate[]>("/api/tcmb");
