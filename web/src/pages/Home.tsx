export default function Home() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    localStorage.clear();
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = "/login";
  }

  return <div>Home page</div>;
}
