export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-lg font-bold text-emerald-600">AyesayRent</p>
        <p className="mt-2 text-sm text-zinc-600">
          Trusted Myanmar rental assistance in Thailand
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          ထailandန국ရှိ မြန်မာလူမျိုးများအတွက် ယုံကြည်စိတ်ချရသော
          အခန်းငှားဝန်ဆောင်မှု
        </p>
        <p className="mt-6 text-sm text-zinc-400">
          © {new Date().getFullYear()} AyesayRent. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
