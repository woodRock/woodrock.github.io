export default function RenderTime() {
    const time = new Date().toLocaleString();
    return (
      <p>Freshly server-rendered {time}</p>
    );
  }