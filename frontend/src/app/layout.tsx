import './globals.css';
import { Inter } from 'next/font/google';
import { ApolloWrapper } from '@/apollo/ApolloWrapper';
import { ChakraUIProvider } from '@/components/ChakraUIProvider';
import { AuthProvider } from '@/auth/AuthProvider';
import { ColorModeScript } from '@chakra-ui/react';
import { chakraConfig } from '@/config/chakra.config';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ColorModeScript initialColorMode={chakraConfig.initialColorMode} />

        <ApolloWrapper>
          <AuthProvider>
            <ChakraUIProvider>{children}</ChakraUIProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}