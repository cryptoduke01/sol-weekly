import { ThemeProvider } from "@/components/ThemeProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        {children}
      </div>
    </ThemeProvider>
  );
}

