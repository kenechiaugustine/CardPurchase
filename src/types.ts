export type Network = "MTN" | "Airtel" | "GLO";

export type PriceMap = {
  [network in Network]: {
    [denomination: number]: number;
  };
};

export interface SessionItem {
  network: string;
  denomination: number;
  quantity: string;
  price: number;
  total: number;
}

export interface Session {
  id: number;
  date: string;
  items: SessionItem[];
  overallTotal: number;
}
