import PlayerShell from '@/components/lms/PlayerShell'

export default function PlayerShellLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  return <PlayerShell slug={params.slug}>{children}</PlayerShell>
}
