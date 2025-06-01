'use client';

import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { chakraConfig } from '../config/chakra.config'; 
import { EmotionCacheProvider } from './EmotionCacheProvider'; 

export const theme = extendTheme({
  config: chakraConfig,
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('gray.50', 'gray.800')(props),
        color: mode('gray.800', 'whiteAlpha.900')(props),
      },
    }),
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    brand: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795',
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
      },
      variants: {
        solid: (props: any) => ({
          bg: mode('blue.500', 'blue.300')(props),
          color: mode('white', 'gray.800')(props),
          _hover: {
            bg: mode('blue.600', 'blue.400')(props),
          },
        }),
      },
    },
    Input: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: mode('gray.100', 'gray.700')(props),
            _hover: {
              bg: mode('gray.200', 'gray.600')(props),
            },
            _focus: {
              borderColor: mode('blue.400', 'blue.200')(props),
            },
          },
        }),
      },
    },
  },
});

export function ChakraUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider> 
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </EmotionCacheProvider>
  );
}