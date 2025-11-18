export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold tracking-wide">
          <span>FamilyTree</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
}


