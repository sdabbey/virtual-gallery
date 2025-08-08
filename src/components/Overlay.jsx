// Overlay.jsx
export default function Overlay({ title, artist, description, onClose }) {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 text-white flex flex-col items-center justify-center p-6"
      onClick={onClose}
    >
      <h1 className="text-3xl font-bold">{title}</h1>
      <h2 className="text-xl italic mb-4">{artist}</h2>
      <p className="max-w-xl">{description}</p>
      <p className="mt-6 text-sm opacity-70">(Press ESC or click background to exit)</p>
    </div>
  );
}
