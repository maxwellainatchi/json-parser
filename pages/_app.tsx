import '../styles/globals.css'
import type { AppProps } from 'next/app'

// 1. import `NextUIProvider` component
import { NextUIProvider } from '@nextui-org/react';


const MyApp = ({ Component, pageProps }: AppProps) => (
    <NextUIProvider>
        <Component {...pageProps} />
    </NextUIProvider>
);

export default MyApp
