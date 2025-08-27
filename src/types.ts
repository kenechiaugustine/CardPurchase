export type Network = "MTN" | "Airtel" | "GLO";

export type PriceMap = {
  [network in Network]: {
    [denomination: number]: number;
  };
};

export interface SessionItem {
  network: string;
  denomination: number;
  quantity: string; // The raw quantity string, e.g., "1/2" or "5"
  price: number; // The price per 10-pack or unit
  total: number; // The calculated total for this item
}

export interface Session {
  id: number; // Unique ID, we'll use a timestamp
  date: string; // ISO date string for display
  items: SessionItem[];
  overallTotal: number;
}
