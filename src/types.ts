export type Network = "MTN" | "Airtel" | "GLO";

export type PriceMap = {
  [network in Network]: {
    [denomination: number]: number;
  };
};
