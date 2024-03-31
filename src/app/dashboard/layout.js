import Sidebar from "../components/dashboard/sidebar/sidebar";
import Navbar from "../components/dashboard/navbar/navbar";
import Footer from "../components/dashboard/footer/footer";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <div className="w-[300px] p-5 bg-[#182237] min-h-lvh">
            <Sidebar />
          </div>
          <div className="flex flex-col flex-grow p-5">
            <Navbar />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
