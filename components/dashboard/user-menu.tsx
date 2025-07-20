import {
  LogOut,
  MoveUpRight,
  Settings,
  CreditCard,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface UserMenuProps {
  name: string;
  role: string;
  avatar: string;
  subscription?: string;
}

const defaultProfile = {
  name: "Eugene An",
  role: "Prompt Engineer",
  avatar: "",
  subscription: "Free Trial",
} satisfies Required<UserMenuProps>;

export default function UserMenu({
  name = defaultProfile.name,
  role = defaultProfile.role,
  avatar = defaultProfile.avatar,
  subscription = defaultProfile.subscription,
}: Partial<UserMenuProps> = defaultProfile) {
  const menuItems: MenuItem[] = [
    {
      label: "Subscription",
      value: subscription,
      href: "#",
      icon: <CreditCard className="w-4 h-4" />,
      external: false,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: "Terms & Policies",
      href: "#",
      icon: <FileText className="w-4 h-4" />,
      external: true,
    },
  ];

  return (
    <div className="w-full max-w-sm">
      <div className="bg-card rounded-lg shadow-sm">
        <div className="p-4">
          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground">
                {name}
              </h3>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.value && (
                    <span className="text-xs text-muted-foreground">
                      {item.value}
                    </span>
                  )}
                  {item.external && (
                    <MoveUpRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </Link>
            ))}

            <button
              type="button"
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
