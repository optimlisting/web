// Platform exports
export * from "./etsy";

// Future:
// export * from "./ebay";
// export * from "./amazon";

// Shared types
export interface ConnectionStatus {
  connected: boolean;
  shopName?: string;
  shopId?: string;
}
