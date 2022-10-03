import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ReactNode } from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const navigation = useMemo(
    () => [
      { name: 'Dashboard', href: '/', current: router.asPath === '/' },
      {
        name: 'My Vaults',
        href: '/my-vaults',
        current: router.asPath === '/my-vaults',
      },
    ],
    [router.asPath],
  )

  return (
    <div className="min-h-screen text-black bg-white dark:bg-black dark:text-white dark">
      <Navbar navigation={navigation} />
      <div className="lg:min-h-[90vh]">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
