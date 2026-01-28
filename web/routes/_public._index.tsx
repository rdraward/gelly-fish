import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/api";

export default function () {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"idle" | "pressed">("idle");

  const EXPANSION_DURATION_MS = 600;

  useEffect(() => {
    if (phase !== "pressed") return;

    // Navigate after the logo expansion completes - add small delay to ensure animation finishes
    const navT = window.setTimeout(async () => {
      try {
        const challenges = await api.challenge.findMany({
          sort: { challengeId: "Ascending" },
          first: 1,
        });
        if (challenges.length > 0) {
          // Use the numeric challengeId for routing
          navigate(`/challenge/${challenges[0].challengeId}`);
        }
      } catch (error) {
        console.error("Failed to fetch first challenge:", error);
      }
    }, EXPANSION_DURATION_MS - 250);

    return () => {
      window.clearTimeout(navT);
    };
  }, [phase, navigate]);

  const jellySvgLogo = useMemo(
    () => (
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          d="m13.7657 6.63562c.0151.2204-.1655.40008-.3864.40008h-2.3555c.0296.16508.0986.2714.2012.42963l.0003.00048c.1796.27643.4249.65507.4249 1.34099 0 .68504-.2455 1.06362-.4245 1.3397l-.0004.0007c-.1408.2163-.218.3355-.218.6402 0 .3049.0774.4241.2177.6405l.0003.0005c.1793.2764.4249.655.4249 1.3406 0 .6846-.2452 1.0632-.4241 1.3395l-.0008.0012c-.1408.2163-.218.3353-.218.6403h-1.28566c0-.6856.24557-1.0642.42496-1.3404v-.0001c.1405-.2162.2179-.3355.2179-.6405 0-.3048-.0774-.4241-.2176-.6404l-.0003-.0005c-.17939-.2764-.42496-.6551-.42496-1.3407 0-.6852.24557-1.06388.42496-1.33999.1407-.21632.2179-.33557.2179-.64028 0-.30514-.0774-.42443-.2176-.64078l-.0003-.00047c-.16011-.24671-.37293-.57484-.41684-1.13018h-1.35732c.02963.16508.09856.2714.20115.42963l.00031.00048c.17936.27643.42493.65507.42493 1.34099 0 .68561-.24557 1.06425-.42525 1.3404l-.00044.0006c-.13986.2159-.21716.3352-.21716.6393 0 .3048.07735.4241.21761.6405l.00031.0004c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0643-.42493 1.3407l-.00075.0012c-.13999.2159-.21717.3349-.21717.6394h-1.28571c0-.6856.24557-1.0642.42493-1.3404l.00075-.0011c.13998-.2159.21717-.335.21717-.6398s-.07718-.4238-.21717-.6397l-.00075-.0012-.00013-.0002c-.17934-.2764-.4248-.6547-.4248-1.3405 0-.6853.24557-1.06391.42493-1.34001l.00006-.0001c.14042-.21626.21786-.33552.21786-.64019 0-.30513-.07735-.42443-.21761-.64077l-.00031-.00047-.00047-.00073c-.15999-.24686-.37239-.57459-.41631-1.12913h-1.35012c.03312.14309.09889.24452.19295.38959l.00031.00048c.17936.27643.42493.65507.42493 1.341 0 .6856-.24557 1.06424-.42525 1.34033-.14047.2163-.21761.3356-.21761.6403 0 .3048.07735.4241.21762.6404l.00031.0005c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0642-.42493 1.3407l-.00027.0004c-.14029.2157-.21766.3347-.21766.6395h-1.2857c0-.6856.24557-1.0642.42492-1.3403l.00007-.0001c.14042-.2163.21786-.3355.21786-.6405 0-.3048-.07735-.4241-.21762-.6405l-.00031-.0004c-.17935-.2765-.42492-.6551-.42492-1.3407 0-.6853.24557-1.06394.42492-1.34005l.00007-.00011c.14042-.21625.21786-.33551.21786-.64017 0-.30513-.07735-.42443-.21762-.64077l-.00031-.00048c-.15616-.24068-.36251-.55884-.41328-1.08982h-1.82161c-.22091 0-.40143-.17968-.38638-.40008.20549-3.00869 2.71124-5.38562 5.77207-5.38562 3.06085 0 5.56655 2.37693 5.77205 5.38562z"
          fill="#9260d2"
        />
      </svg>
    ),
    []
  );

  const backgroundLogo = useMemo(
    () => (
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          d="m13.7657 6.63562c.0151.2204-.1655.40008-.3864.40008h-2.3555c.0296.16508.0986.2714.2012.42963l.0003.00048c.1796.27643.4249.65507.4249 1.34099 0 .68504-.2455 1.06362-.4245 1.3397l-.0004.0007c-.1408.2163-.218.3355-.218.6402 0 .3049.0774.4241.2177.6405l.0003.0005c.1793.2764.4249.655.4249 1.3406 0 .6846-.2452 1.0632-.4241 1.3395l-.0008.0012c-.1408.2163-.218.3353-.218.6403h-1.28566c0-.6856.24557-1.0642.42496-1.3404v-.0001c.1405-.2162.2179-.3355.2179-.6405 0-.3048-.0774-.4241-.2176-.6404l-.0003-.0005c-.17939-.2764-.42496-.6551-.42496-1.3407 0-.6852.24557-1.06388.42496-1.33999.1407-.21632.2179-.33557.2179-.64028 0-.30514-.0774-.42443-.2176-.64078l-.0003-.00047c-.16011-.24671-.37293-.57484-.41684-1.13018h-1.35732c.02963.16508.09856.2714.20115.42963l.00031.00048c.17936.27643.42493.65507.42493 1.34099 0 .68561-.24557 1.06425-.42525 1.3404l-.00044.0006c-.13986.2159-.21716.3352-.21716.6393 0 .3048.07735.4241.21761.6405l.00031.0004c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0643-.42493 1.3407l-.00075.0012c-.13999.2159-.21717.3349-.21717.6394h-1.28571c0-.6856.24557-1.0642.42493-1.3404l.00075-.0011c.13998-.2159.21717-.335.21717-.6398s-.07718-.4238-.21717-.6397l-.00075-.0012-.00013-.0002c-.17934-.2764-.4248-.6547-.4248-1.3405 0-.6853.24557-1.06391.42493-1.34001l.00006-.0001c.14042-.21626.21786-.33552.21786-.64019 0-.30513-.07735-.42443-.21761-.64077l-.00031-.00047-.00047-.00073c-.15999-.24686-.37239-.57459-.41631-1.12913h-1.35012c.03312.14309.09889.24452.19295.38959l.00031.00048c.17936.27643.42493.65507.42493 1.341 0 .6856-.24557 1.06424-.42525 1.34033-.14047.2163-.21761.3356-.21761.6403 0 .3048.07735.4241.21762.6404l.00031.0005c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0642-.42493 1.3407l-.00027.0004c-.14029.2157-.21766.3347-.21766.6395h-1.2857c0-.6856.24557-1.0642.42492-1.3403l.00007-.0001c.14042-.2163.21786-.3355.21786-.6405 0-.3048-.07735-.4241-.21762-.6405l-.00031-.0004c-.17935-.2765-.42492-.6551-.42492-1.3407 0-.6853.24557-1.06394.42492-1.34005l.00007-.00011c.14042-.21625.21786-.33551.21786-.64017 0-.30513-.07735-.42443-.21762-.64077l-.00031-.00048c-.15616-.24068-.36251-.55884-.41328-1.08982h-1.82161c-.22091 0-.40143-.17968-.38638-.40008.20549-3.00869 2.71124-5.38562 5.77207-5.38562 3.06085 0 5.56655 2.37693 5.77205 5.38562z"
          fill="#9260d2"
        />
      </svg>
    ),
    []
  );

  return (
    <div className="relative overflow-hidden h-full">
      {/* Background Carousel */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, rowIndex) => {
          const isLeft = rowIndex % 2 === 0;
          return (
            <div
              key={rowIndex}
              className={`gelly-bg-row flex gap-0 w-max py-8 ${isLeft ? "gelly-bg-row--left" : "gelly-bg-row--right"}`}
              style={{
                animationDuration: `${35 + rowIndex * 2}s`,
              }}
            >
              <div className="flex gap-16 pl-16 shrink-0">
                {Array.from({ length: 20 }).map((_, logoIndex) => (
                  <div
                    key={logoIndex}
                    className="w-20 h-20 opacity-20 shrink-0"
                  >
                    {backgroundLogo}
                  </div>
                ))}
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex gap-16 pl-16 shrink-0">
                {Array.from({ length: 20 }).map((_, logoIndex) => (
                  <div
                    key={`dup-${logoIndex}`}
                    className="w-20 h-20 opacity-20 shrink-0"
                  >
                    {backgroundLogo}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Section */}
      <section className="relative text-white/92 flex items-center justify-center h-full">
        <div
          className={`gelly-logo fixed w-[min(65vw,480px)] h-[min(65vw,480px)] left-1/2 top-1/2 opacity-100 z-0 origin-center ${phase === "pressed" ? "gelly-logo--expanding z-[9999]" : ""}`}
          aria-hidden="true"
        >
          {jellySvgLogo}
        </div>
        <div className="gelly-hero relative z-10 mx-auto max-w-4xl w-full text-center flex flex-col gap-4 sm:gap-6 h-full justify-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-center">
            gelly.fish like a pro
          </h1>
          <p className="text-white/82 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto [text-shadow:0_10px_30px_rgba(0,0,0,0.35)]">
            <span className="font-semibold">Learn Gelly</span> through
            interactive tutorials
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="w-auto bg-transparent p-0 hover:bg-transparent"
            >
              <button
                type="button"
                className={`gelly-cta relative inline-flex items-center justify-center gap-2 py-3 sm:py-[0.9rem] px-4 sm:px-5 rounded-2xl text-sm sm:text-[1.125rem] font-bold tracking-[0.01em] select-none -translate-y-0.5 ${phase === "pressed" ? "gelly-cta--pressed" : ""}`}
                onClick={() => setPhase("pressed")}
                aria-label="Get wigglin' (start tutorial)"
                disabled={phase === "pressed"}
              >
                <span className="gelly-cta__label relative z-10">
                  Get jigglin'
                </span>
              </button>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center p-6 gelly-footer">
        <a
          href="https://gadget.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-white/70 text-sm no-underline transition-colors hover:text-white/90"
        >
          <span>Built with</span>
          <img
            src="/gadget.svg"
            alt="Gadget"
            className="w-5 h-5 opacity-80 transition-opacity hover:opacity-100"
          />
          <span>Gadget</span>
        </a>
      </footer>
    </div>
  );
}
