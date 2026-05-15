import "./globals.css";

export const metadata = { title: "Botlane Lab V4", description: "Coach botlane personnel avec Riot API" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
