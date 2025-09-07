import '@/app/_styles/globals.css';

import { Josefin_Sans } from 'next/font/google';
import Header from './_components/Header';
import RangeProvider from './_components/RangeContext';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
});


export const metadata = {
  title: {
    template: '%s / Wild Oasis',
    default: 'Welcome / Wild Oasis',
  },

  description:
    'Discover The Wild Oasis – a serene getaway offering unique stays surrounded by nature. Enjoy eco-friendly cabins, breathtaking views, and unforgettable experiences. Perfect for relaxation, adventure, and reconnecting with the wild.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className}  bg-primary-950 antialiased flex flex-col text-primary-100 min-h-screen`}
      >
        <Header />

        <div className="flex-1 px-8 py-12 grid ">
          <main className="max-w-7xl mx-auto w-full ">
            <RangeProvider>{children}</RangeProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
