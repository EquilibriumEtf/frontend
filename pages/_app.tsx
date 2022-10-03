import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../contexts/theme'
import { Layout } from 'components/layout'
import { Toaster } from 'react-hot-toast'

import WalletProvider from 'client/react/wallet/WalletProvider'
import { TxProvider } from 'contexts/tx'

const EquilibriumApp = ({ Component, pageProps }: AppProps) => {
  return (
    <main className="dark">
      <Toaster position="top-right" />
      <WalletProvider>
        <ThemeProvider>
          <TxProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </TxProvider>
        </ThemeProvider>
      </WalletProvider>
    </main>
  )
}

export default EquilibriumApp
