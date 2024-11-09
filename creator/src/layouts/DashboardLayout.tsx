import { Bell, Home, Package, Package2, LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/sign-in");
  };

  const NavLinkItem = ({
    to,
    Icon,
    label,
  }: {
    to: string;
    Icon: LucideIcon;
    label: string;
  }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-muted-foreground hover:text-primary ${
          isActive ? "bg-muted" : ""
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Logo and Notification */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>Coder's Book</span>
            </Link>
            <button className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLinkItem to="/dashboard/home" Icon={Home} label="Home" />
              <NavLinkItem to="/dashboard/books" Icon={Package} label="Books" />
            </nav>
          </div>

          {/* Footer */}
          <div className="mt-auto p-4">
            <div className="p-2 pt-0 md:p-4">
              <p>Upgrade to Pro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="flex flex-1 items-center justify-end gap-4">
            {token ? (
              <div
                onClick={handleLogout}
                className="rounded-md border cursor-pointer border-primary-500 py-2 px-4 text-sm font-medium text-primary-500 transition-all hover:border-primary-100 hover:bg-primary-100 active:border-primary-200 active:bg-primary-200"
              >
                Log out
              </div>
            ) : (
              <Link
                to="/auth/sign-in"
                className="rounded-md border border-primary-500 py-2 px-4 text-sm font-medium text-primary-500 transition-all hover:border-primary-100 hover:bg-primary-100 active:border-primary-200 active:bg-primary-200"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>

        {/* Outlet for rendering content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
