import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router";

export default function () {
  const navigate = useNavigate();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [phase, setPhase] = useState<"idle" | "pressed">("idle");
  const [wipe, setWipe] = useState<null | { x: number; y: number }>(null);

  const WIPE_DURATION_MS = 1500;

  useEffect(() => {
    if (phase !== "pressed") return;

    // Capture the click origin from the button position for the wipe.
    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    setWipe({ x, y });

    // Navigate after the wipe completes.
    const navT = window.setTimeout(() => navigate("/tutorial"), WIPE_DURATION_MS - 500);
    const clearT = window.setTimeout(() => setWipe(null), WIPE_DURATION_MS + 200);
    return () => {
      window.clearTimeout(navT);
      window.clearTimeout(clearT);
    };
  }, [phase, navigate, WIPE_DURATION_MS]);

  const jellySvgButton = useMemo(
    () => (
      <svg
        className="gelly-cta__jelly text-white"
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

  const jellySvgWipe = useMemo(
    () => (
      <svg
        className="gelly-wipe__svg"
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
    <div className="relative">
      <style>{`
        :root { --gelly: #9260d2; }

        .gelly-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.9rem 1.25rem;
          border-radius: 16px;
          border: 2px solid color-mix(in oklab, var(--gelly), white 10%);
          background:
            radial-gradient(120% 180% at 20% 10%,
              color-mix(in oklab, var(--gelly), white 18%) 0%,
              var(--gelly) 60%,
              color-mix(in oklab, var(--gelly), black 16%) 100%);
          color: white;
          font-weight: 700;
          letter-spacing: 0.01em;
          transform-style: preserve-3d;
          transform: translateY(-2px);
          box-shadow:
            0 16px 0 0 color-mix(in oklab, var(--gelly), black 40%),
            0 24px 40px -16px rgba(0,0,0,0.5);
          transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .gelly-cta::before {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: inherit;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0.28),
            rgba(255,255,255,0.02)
          );
          mix-blend-mode: screen;
          pointer-events: none;
          opacity: 0.9;
        }

        .gelly-cta:focus-visible {
          outline: 3px solid color-mix(in oklab, var(--gelly), white 45%);
          outline-offset: 4px;
        }

        .gelly-cta:hover {
          filter: saturate(1.08);
          animation: gelly-wiggle 520ms ease-in-out infinite;
        }

        /* Border “jiggle” via shifting radii + tiny rotation/translation */
        @keyframes gelly-wiggle {
          0%   { border-radius: 16px 20px 16px 22px; transform: translateY(-2px) rotate(0deg) translateX(0); }
          18%  { border-radius: 22px 16px 20px 16px; transform: translateY(-2px) rotate(-1deg) translateX(-1px); }
          38%  { border-radius: 16px 22px 16px 20px; transform: translateY(-3px) rotate(1.2deg) translateX(1px); }
          62%  { border-radius: 20px 16px 24px 16px; transform: translateY(-2px) rotate(-0.8deg) translateX(-1px); }
          100% { border-radius: 16px 20px 16px 22px; transform: translateY(-2px) rotate(0deg) translateX(0); }
        }

        .gelly-cta:active {
          transform: translateY(8px) scaleY(0.92) scaleX(0.98);
          box-shadow:
            0 6px 0 0 color-mix(in oklab, var(--gelly), black 42%),
            0 14px 26px -18px rgba(0,0,0,0.55);
        }

        .gelly-cta__label {
          position: relative;
          z-index: 1;
          transition: opacity 140ms ease, transform 240ms ease;
        }

        .gelly-cta__jelly {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 26px;
          height: 26px;
          opacity: 0;
          transform: translateZ(1px) scale(0.65);
          transition: opacity 140ms ease, transform 380ms cubic-bezier(.2,.9,.2,1);
          z-index: 2;
          filter: drop-shadow(0 6px 10px rgba(0,0,0,0.35));
        }

        .gelly-cta--pressed {
          animation: gelly-squish 520ms cubic-bezier(.2,.9,.2,1) both;
        }

        .gelly-cta--pressed:hover { animation: none; }

        .gelly-cta--pressed .gelly-cta__label {
          opacity: 0;
          transform: translateY(6px) scale(0.94);
        }

        .gelly-cta--pressed .gelly-cta__jelly {
          opacity: 1;
          transform: translateZ(1px) scale(1.35);
        }

        @keyframes gelly-squish {
          0%   { transform: translateY(-2px) scale(1,1); border-radius: 16px; }
          35%  { transform: translateY(10px) scale(1.08,0.72); border-radius: 28px 28px 18px 18px; }
          62%  { transform: translateY(6px) scale(0.92,1.12); border-radius: 22px 22px 30px 30px; }
          100% { transform: translateY(8px) scale(1,1); border-radius: 26px 26px 34px 34px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gelly-cta, .gelly-cta:hover, .gelly-cta--pressed { animation: none !important; transition: none !important; }
          .gelly-cta__label, .gelly-cta__jelly { transition: none !important; }
          .gelly-wipe, .gelly-wipe__jelly { animation: none !important; transition: none !important; }
        }

        /* Full-page wipe starting at the CTA */
        .gelly-wipe {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
        }

        .gelly-wipe__jelly {
          position: absolute;
          left: var(--wipe-x);
          top: var(--wipe-y);
          width: 40px;
          height: 40px;
          transform-origin: center;
          transform: translate(-50%, -50%) scale(0.6);
          opacity: 1;
          color: #9260d2;
          filter: drop-shadow(0 18px 26px rgba(0,0,0,0.35));
          will-change: transform, opacity;
          animation: gelly-star-wipe var(--wipe-ms) linear forwards;
        }

        /* The SVG we reuse was authored for the button and carries .gelly-cta__jelly styles.
           Force it to behave like a normal sized SVG inside the wipe container. */
        .gelly-wipe__jelly svg {
          position: static !important;
          inset: auto !important;
          margin: 0 !important;
          width: 100% !important;
          height: 100% !important;
          opacity: 1 !important;
          transform: none !important;
          filter: none !important;
        }

        @keyframes gelly-star-wipe {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(220); opacity: 0; }
        }
      `}</style>

      {wipe && (
        <div
          className="gelly-wipe"
          style={
            {
              ["--wipe-ms" as any]: `${WIPE_DURATION_MS}ms`,
              ["--wipe-x" as any]: `${wipe.x}px`,
              ["--wipe-y" as any]: `${wipe.y}px`,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <div className="gelly-wipe__jelly">{jellySvgWipe}</div>
        </div>
      )}
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="mx-auto max-w-4xl px-8 text-center flex flex-col gap-6">
          <h1 className="text-6xl font-bold tracking-tight text-center">👋 Hey, Developer!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ARE YOU READY TO GELLY?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="w-auto bg-transparent p-0 hover:bg-transparent">
              <button
                type="button"
                ref={btnRef}
                className={`gelly-cta ${phase === "pressed" ? "gelly-cta--pressed" : ""}`}
                onClick={() => setPhase("pressed")}
                aria-label="Get wigglin' (start tutorial)"
                disabled={phase === "pressed"}
              >
                <span className="gelly-cta__label">Get wigglin'</span>
                {jellySvgButton}
              </button>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}