import { LensKitProvider } from '@lenskit/react'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import '../styles/globals.css'
import Header from '../components/Header'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.polygonMumbai],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

const links = [
  { link: '/posts', label: 'Posts', links: undefined },
  { link: '/create-post', label: 'Create Post', links: undefined },
]

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <LensKitProvider>
              <Header links={links} />
              <Component {...pageProps} />
            </LensKitProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
