import './mainpage.css';
import Navbar from './@navbar/page';

export const metadata = {
  title: 'JEE Counselling',
  description: 'JEE Counselling Form',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="content">
          {children}
        </main>
      </body>
    </html>
  )
}
