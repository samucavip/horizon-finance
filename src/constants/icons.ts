import {
  ShoppingCart, Home, Car, Utensils, HeartPulse, GraduationCap, Plane,
  Gift, Film, Zap, Wifi, Dumbbell, PawPrint, Shirt, Coffee, Fuel,
  Wrench, Baby, Book, Music, Smartphone, DollarSign, Briefcase,
  Landmark, Receipt, Wallet, Repeat, CreditCard,
  type LucideIcon,
} from "lucide-react";

// Icons selectable for categories/accounts. Keyed by name so the choice can be
// persisted as a plain string.
export const ICONS: Record<string, LucideIcon> = {
  ShoppingCart, Home, Car, Utensils, HeartPulse, GraduationCap, Plane,
  Gift, Film, Zap, Wifi, Dumbbell, PawPrint, Shirt, Coffee, Fuel,
  Wrench, Baby, Book, Music, Smartphone, DollarSign, Briefcase,
  Landmark, Receipt, Wallet, Repeat, CreditCard,
};

export const ICON_NAMES = Object.keys(ICONS);

export function resolveIcon(name?: string | null): LucideIcon {
  return (name && ICONS[name]) || Receipt;
}
