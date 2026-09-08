export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Viewmax</h1>
      <p>Welcome to Viewmax. This app connects to the API at {process.env.NEXT_PUBLIC_API_URL}.</p>
    </main>
  );
}
