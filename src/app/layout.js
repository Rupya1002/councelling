import './mainpage.css';

export const metadata = {
  title: 'JEE Counselling',
  description: 'JEE Counselling Form',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
