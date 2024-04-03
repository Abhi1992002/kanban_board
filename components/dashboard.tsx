import { Sidebar } from "./dashboard/sidebar";
import { MainContent } from "./dashboard/main-content";

export function Dashboard() {
  return (
    <div className="grid min-h-screen  md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <MainContent />
    </div>
  );
}
