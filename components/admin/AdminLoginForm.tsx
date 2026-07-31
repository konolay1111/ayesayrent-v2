"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, type SignInState } from "@/app/admin/actions";
import { BilingualLabel } from "@/components/BilingualLabel";

const initialState: SignInState = { error: null };

const inputClassName =
  "h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

type AdminLoginFormProps = {
  initialError?: string | null;
};

export function AdminLoginForm({ initialError = null }: AdminLoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialError ? { error: initialError } : initialState,
  );

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-800">
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <Link
              href="/"
              className="text-xl font-bold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              AyesayRent
            </Link>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
              အက်ဒမင် ဝင်ရောက်ရန်
            </h1>
            <p className="mt-1 text-sm font-medium text-emerald-600">
              Admin Login
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              Authorized staff only. Customer accounts cannot access this area.
            </p>
          </div>

          <form action={formAction} className="mt-8 space-y-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700"
              >
                <BilingualLabel myanmar="အီးမေးလ်" english="Email" />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700"
              >
                <BilingualLabel myanmar="စကားဝှက်" english="Password" />
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={inputClassName}
              />
            </div>

            {state.error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {state.error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-12 w-full flex-col items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <span>ဝင်ရောက်နေပါသည်...</span>
                  <span className="text-xs font-normal text-emerald-100">
                    Signing in...
                  </span>
                </>
              ) : (
                <>
                  <span>အက်ဒမင် ဝင်ရန်</span>
                  <span className="text-xs font-normal text-emerald-100">
                    Admin Login
                  </span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <Link
              href="/"
              className="font-medium text-emerald-600 transition-colors hover:text-emerald-700"
            >
              ← Back to website
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
