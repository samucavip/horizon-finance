import {
  LayoutDashboard, Wallet, CreditCard, Tags, PiggyBank, Target, Receipt,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "accounts", label: "Contas", href: "/accounts", icon: Wallet },
  { key: "transactions", label: "Lançamentos", href: "/transactions", icon: Receipt },
  { key: "cards", label: "Cartões", href: "/cards", icon: CreditCard },
  { key: "categories", label: "Categorias", href: "/categories", icon: Tags },
  { key: "budget", label: "Orçamento", href: "/budget", icon: PiggyBank },
  { key: "goals", label: "Metas", href: "/goals", icon: Target },
];

export const APP_NAME = "Duas Praças";
