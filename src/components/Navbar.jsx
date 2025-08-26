import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const { isAuthenticated, user, logout, role } = useAuth();
  const { isConnected } = useSocket();
  const userMenuRef = useRef(null);

  const getUserRole = () => {
    return role || localStorage.getItem("select_role") || user?.role || "user";
  };

  const isAdmin = getUserRole() === "admin";

  const getNavigationItems = () => {
    const baseItems = [
      { to: "/", label: "Home" },
      // { to: "/about", label: "About Us" },
      { to: "https://www.et.iitb.ac.in/", label: "About Us", external: true },
      { to: "/toolkit", label: "Toolkit" },
      { to: "/resources", label: "Resources" },
      { to: "/contact", label: "Contact" },
    ];

    if (!isAuthenticated) {
      return [...baseItems, { to: "/login", label: "Login" }];
    }

    return [
      ...baseItems,
      // { to: "/assess", label: "Assessment" },
      // { to: "/results", label: "Results" },
    ];
  };

  const items = getNavigationItems();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setUserMenuOpen(false);
      navigate("/");
    }
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email;
    return "User";
  };

  // const ConnectionStatus = () => {
  //   if (!isAuthenticated || !isAdmin) return null;

  //   return (
  //     <div className="flex items-center space-x-2 px-3 py-2">
  //       <div
  //         className={`w-2 h-2 rounded-full ${
  //           isConnected ? "bg-green-500" : "bg-red-500"
  //         }`}
  //       ></div>
  //       <span className="text-xs text-white opacity-75">
  //         {isConnected ? "Live" : "Offline"}
  //       </span>
  //     </div>
  //   );
  // };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 bg-primary transition-shadow duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-white text-2xl text-semibold font-bold"
            aria-label="Go to Home"
          >
            SelECT
          </button>

          <div className="hidden md:flex items-center space-x-2">
            {items.map((it) =>
              it.external ? (
                <a
                  key={it.to}
                  href={it.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-2 flex items-center space-x-2 text-sm md:text-base transition-colors ${
                    isActive(it.to)
                      ? "text-white font-semibold underline underline-offset-4"
                      : "text-white hover:text-gray-200"
                  }`}
                >
                  <span>{it.label}</span>
                </a>
              ) : (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`px-3 py-2 flex items-center space-x-2 text-sm md:text-base transition-colors ${
                    isActive(it.to)
                      ? "text-white font-semibold underline underline-offset-4"
                      : "text-white hover:text-gray-200"
                  }`}
                >
                  <span>{it.label}</span>
                </Link>
              )
            )}

            {/* <ConnectionStatus /> */}

            {isAuthenticated && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-white hover:text-gray-200 transition-colors"
                  aria-label="User menu"
                >
                  <FiUser size={18} />
                  <span className="text-sm md:text-base">
                    {getUserDisplayName()}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                      {user?.designation && (
                        <p className="text-xs text-gray-500 mt-1">
                          {user.designation}
                        </p>
                      )}
                      {isAdmin && (
                        <div className="flex items-center space-x-2 mt-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isConnected ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-xs text-gray-500">
                            {isConnected ? "Connected" : "Disconnected"}
                          </span>
                        </div>
                      )}
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FiSettings size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
            onClick={() => setOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-3">
            {items.map((it) => {
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 text-white ${
                    isActive(it.to)
                      ? "font-semibold underline underline-offset-4"
                      : "hover:text-gray-200"
                  }`}
                >
                  <span>{it.label}</span>
                </Link>
              );
            })}

            {isAuthenticated && (
              <div className="border-t border-white/20 mt-2 pt-2">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 text-white mb-2">
                    <FiUser size={18} />
                    <span className="font-medium">{getUserDisplayName()}</span>
                  </div>
                  <p className="text-xs text-gray-300 ml-6">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 ml-6 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                  {user?.designation && (
                    <p className="text-xs text-gray-300 ml-6 mt-1">
                      {user.designation}
                    </p>
                  )}
                  {isAdmin && (
                    <div className="flex items-center space-x-2 ml-6 mt-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-xs text-gray-300">
                        {isConnected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:text-gray-200"
                  >
                    <FiSettings size={16} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-white hover:text-gray-200"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
