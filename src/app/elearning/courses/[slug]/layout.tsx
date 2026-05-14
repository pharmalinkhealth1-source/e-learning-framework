import PlayerShell from '@/components/lms/PlayerShell'

export default async function PlayerShellLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <PlayerShell slug={slug}>{children}</PlayerShell>
}
