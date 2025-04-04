export default function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer class="py-4 text-center text-sm text-gray-600">
        &copy; {year} Jesse Wood. All rights reserved.
      </footer>
    );
  }
  