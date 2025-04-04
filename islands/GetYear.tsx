export default function GetYear() {
    const year = new Date().getFullYear();
    return (
      <p> {year} </p>
    );
  }