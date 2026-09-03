import { loadProjects } from "@/lib/projects-admin";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Bolmsö Scripts" };

export default async function AdminPage() {
  const { projects } = await loadProjects();
  return <AdminDashboard initialProjects={projects} />;
}
