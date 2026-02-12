// src/components/Layout.jsx
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-10 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;