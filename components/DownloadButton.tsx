interface DownloadButtonProps {
  filename: string;
  label?: string;
}

export default function DownloadButton({ filename, label = "Download PDF" }: DownloadButtonProps) {
  return (
    <a href={`/download?filename=${encodeURIComponent(filename)}`}>
      <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {label}
      </button>
    </a>
  );
}