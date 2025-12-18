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
          sort: { createdAt: "Ascending" },
          first: 1,
        });
        if (challenges.length > 0) {
          navigate(`/challenge/${challenges[0].id}`);
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
        className="gelly-logo__svg"
        fill="none"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        {/* Body - static */}
        <g className="gelly-body">
          <path
            d="m13.7657 6.63562c.0151.2204-.1655.40008-.3864.40008h-2.3555c.0296.16508.0986.2714.2012.42963l.0003.00048c.1796.27643.4249.65507.4249 1.34099 0 .68504-.2455 1.06362-.4245 1.3397l-.0004.0007c-.1408.2163-.218.3355-.218.6402 0 .3049.0774.4241.2177.6405l.0003.0005c.1793.2764.4249.655.4249 1.3406 0 .6846-.2452 1.0632-.4241 1.3395l-.0008.0012c-.1408.2163-.218.3353-.218.6403h-1.28566c0-.6856.24557-1.0642.42496-1.3404v-.0001c.1405-.2162.2179-.3355.2179-.6405 0-.3048-.0774-.4241-.2176-.6404l-.0003-.0005c-.17939-.2764-.42496-.6551-.42496-1.3407 0-.6852.24557-1.06388.42496-1.33999.1407-.21632.2179-.33557.2179-.64028 0-.30514-.0774-.42443-.2176-.64078l-.0003-.00047c-.16011-.24671-.37293-.57484-.41684-1.13018h-1.35732c.02963.16508.09856.2714.20115.42963l.00031.00048c.17936.27643.42493.65507.42493 1.34099 0 .68561-.24557 1.06425-.42525 1.3404l-.00044.0006c-.13986.2159-.21716.3352-.21716.6393 0 .3048.07735.4241.21761.6405l.00031.0004c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0643-.42493 1.3407l-.00075.0012c-.13999.2159-.21717.3349-.21717.6394h-1.28571c0-.6856.24557-1.0642.42493-1.3404l.00075-.0011c.13998-.2159.21717-.335.21717-.6398s-.07718-.4238-.21717-.6397l-.00075-.0012-.00013-.0002c-.17934-.2764-.4248-.6547-.4248-1.3405 0-.6853.24557-1.06391.42493-1.34001l.00006-.0001c.14042-.21626.21786-.33552.21786-.64019 0-.30513-.07735-.42443-.21761-.64077l-.00031-.00047-.00047-.00073c-.15999-.24686-.37239-.57459-.41631-1.12913h-1.35012c.03312.14309.09889.24452.19295.38959l.00031.00048c.17936.27643.42493.65507.42493 1.341 0 .6856-.24557 1.06424-.42525 1.34033-.14047.2163-.21761.3356-.21761.6403 0 .3048.07735.4241.21762.6404l.00031.0005c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0642-.42493 1.3407l-.00027.0004c-.14029.2157-.21766.3347-.21766.6395h-1.2857c0-.6856.24557-1.0642.42492-1.3403l.00007-.0001c.14042-.2163.21786-.3355.21786-.6405 0-.3048-.07735-.4241-.21762-.6405l-.00031-.0004c-.17935-.2765-.42492-.6551-.42492-1.3407 0-.6853.24557-1.06394.42492-1.34005l.00007-.00011c.14042-.21625.21786-.33551.21786-.64017 0-.30513-.07735-.42443-.21762-.64077l-.00031-.00048c-.15616-.24068-.36251-.55884-.41328-1.08982h-1.82161c-.22091 0-.40143-.17968-.38638-.40008.20549-3.00869 2.71124-5.38562 5.77207-5.38562 3.06085 0 5.56655 2.37693 5.77205 5.38562z"
            fill="#9260d2"
            clipPath="url(#body-clip)"
          />
        </g>
        {/* Arms - horizontal sections for independent leg wave motion */}
        <g className="gelly-arms gelly-leg-section-1">
          <path
            d="m13.7657 6.63562c.0151.2204-.1655.40008-.3864.40008h-2.3555c.0296.16508.0986.2714.2012.42963l.0003.00048c.1796.27643.4249.65507.4249 1.34099 0 .68504-.2455 1.06362-.4245 1.3397l-.0004.0007c-.1408.2163-.218.3355-.218.6402 0 .3049.0774.4241.2177.6405l.0003.0005c.1793.2764.4249.655.4249 1.3406 0 .6846-.2452 1.0632-.4241 1.3395l-.0008.0012c-.1408.2163-.218.3353-.218.6403h-1.28566c0-.6856.24557-1.0642.42496-1.3404v-.0001c.1405-.2162.2179-.3355.2179-.6405 0-.3048-.0774-.4241-.2176-.6404l-.0003-.0005c-.17939-.2764-.42496-.6551-.42496-1.3407 0-.6852.24557-1.06388.42496-1.33999.1407-.21632.2179-.33557.2179-.64028 0-.30514-.0774-.42443-.2176-.64078l-.0003-.00047c-.16011-.24671-.37293-.57484-.41684-1.13018h-1.35732c.02963.16508.09856.2714.20115.42963l.00031.00048c.17936.27643.42493.65507.42493 1.34099 0 .68561-.24557 1.06425-.42525 1.3404l-.00044.0006c-.13986.2159-.21716.3352-.21716.6393 0 .3048.07735.4241.21761.6405l.00031.0004c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0643-.42493 1.3407l-.00075.0012c-.13999.2159-.21717.3349-.21717.6394h-1.28571c0-.6856.24557-1.0642.42493-1.3404l.00075-.0011c.13998-.2159.21717-.335.21717-.6398s-.07718-.4238-.21717-.6397l-.00075-.0012-.00013-.0002c-.17934-.2764-.4248-.6547-.4248-1.3405 0-.6853.24557-1.06391.42493-1.34001l.00006-.0001c.14042-.21626.21786-.33552.21786-.64019 0-.30513-.07735-.42443-.21761-.64077l-.00031-.00047-.00047-.00073c-.15999-.24686-.37239-.57459-.41631-1.12913h-1.35012c.03312.14309.09889.24452.19295.38959l.00031.00048c.17936.27643.42493.65507.42493 1.341 0 .6856-.24557 1.06424-.42525 1.34033-.14047.2163-.21761.3356-.21761.6403 0 .3048.07735.4241.21762.6404l.00031.0005c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0642-.42493 1.3407l-.00027.0004c-.14029.2157-.21766.3347-.21766.6395h-1.2857c0-.6856.24557-1.0642.42492-1.3403l.00007-.0001c.14042-.2163.21786-.3355.21786-.6405 0-.3048-.07735-.4241-.21762-.6405l-.00031-.0004c-.17935-.2765-.42492-.6551-.42492-1.3407 0-.6853.24557-1.06394.42492-1.34005l.00007-.00011c.14042-.21625.21786-.33551.21786-.64017 0-.30513-.07735-.42443-.21762-.64077l-.00031-.00048c-.15616-.24068-.36251-.55884-.41328-1.08982h-1.82161c-.22091 0-.40143-.17968-.38638-.40008.20549-3.00869 2.71124-5.38562 5.77207-5.38562 3.06085 0 5.56655 2.37693 5.77205 5.38562z"
            fill="#9260d2"
            clipPath="url(#leg-section-1)"
          />
        </g>
        <g className="gelly-arms gelly-leg-section-2">
          <path
            d="m13.7657 6.63562c.0151.2204-.1655.40008-.3864.40008h-2.3555c.0296.16508.0986.2714.2012.42963l.0003.00048c.1796.27643.4249.65507.4249 1.34099 0 .68504-.2455 1.06362-.4245 1.3397l-.0004.0007c-.1408.2163-.218.3355-.218.6402 0 .3049.0774.4241.2177.6405l.0003.0005c.1793.2764.4249.655.4249 1.3406 0 .6846-.2452 1.0632-.4241 1.3395l-.0008.0012c-.1408.2163-.218.3353-.218.6403h-1.28566c0-.6856.24557-1.0642.42496-1.3404v-.0001c.1405-.2162.2179-.3355.2179-.6405 0-.3048-.0774-.4241-.2176-.6404l-.0003-.0005c-.17939-.2764-.42496-.6551-.42496-1.3407 0-.6852.24557-1.06388.42496-1.33999.1407-.21632.2179-.33557.2179-.64028 0-.30514-.0774-.42443-.2176-.64078l-.0003-.00047c-.16011-.24671-.37293-.57484-.41684-1.13018h-1.35732c.02963.16508.09856.2714.20115.42963l.00031.00048c.17936.27643.42493.65507.42493 1.34099 0 .68561-.24557 1.06425-.42525 1.3404l-.00044.0006c-.13986.2159-.21716.3352-.21716.6393 0 .3048.07735.4241.21761.6405l.00031.0004c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0643-.42493 1.3407l-.00075.0012c-.13999.2159-.21717.3349-.21717.6394h-1.28571c0-.6856.24557-1.0642.42493-1.3404l.00075-.0011c.13998-.2159.21717-.335.21717-.6398s-.07718-.4238-.21717-.6397l-.00075-.0012-.00013-.0002c-.17934-.2764-.4248-.6547-.4248-1.3405 0-.6853.24557-1.06391.42493-1.34001l.00006-.0001c.14042-.21626.21786-.33552.21786-.64019 0-.30513-.07735-.42443-.21761-.64077l-.00031-.00047-.00047-.00073c-.15999-.24686-.37239-.57459-.41631-1.12913h-1.35012c.03312.14309.09889.24452.19295.38959l.00031.00048c.17936.27643.42493.65507.42493 1.341 0 .6856-.24557 1.06424-.42525 1.34033-.14047.2163-.21761.3356-.21761.6403 0 .3048.07735.4241.21762.6404l.00031.0005c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0642-.42493 1.3407l-.00027.0004c-.14029.2157-.21766.3347-.21766.6395h-1.2857c0-.6856.24557-1.0642.42492-1.3403l.00007-.0001c.14042-.2163.21786-.3355.21786-.6405 0-.3048-.07735-.4241-.21762-.6405l-.00031-.0004c-.17935-.2765-.42492-.6551-.42492-1.3407 0-.6853.24557-1.06394.42492-1.34005l.00007-.00011c.14042-.21625.21786-.33551.21786-.64017 0-.30513-.07735-.42443-.21762-.64077l-.00031-.00048c-.15616-.24068-.36251-.55884-.41328-1.08982h-1.82161c-.22091 0-.40143-.17968-.38638-.40008.20549-3.00869 2.71124-5.38562 5.77207-5.38562 3.06085 0 5.56655 2.37693 5.77205 5.38562z"
            fill="#9260d2"
            clipPath="url(#leg-section-2)"
          />
        </g>
        <g className="gelly-arms gelly-leg-section-3">
          <path
            d="m13.7657 6.63562c.0151.2204-.1655.40008-.3864.40008h-2.3555c.0296.16508.0986.2714.2012.42963l.0003.00048c.1796.27643.4249.65507.4249 1.34099 0 .68504-.2455 1.06362-.4245 1.3397l-.0004.0007c-.1408.2163-.218.3355-.218.6402 0 .3049.0774.4241.2177.6405l.0003.0005c.1793.2764.4249.655.4249 1.3406 0 .6846-.2452 1.0632-.4241 1.3395l-.0008.0012c-.1408.2163-.218.3353-.218.6403h-1.28566c0-.6856.24557-1.0642.42496-1.3404v-.0001c.1405-.2162.2179-.3355.2179-.6405 0-.3048-.0774-.4241-.2176-.6404l-.0003-.0005c-.17939-.2764-.42496-.6551-.42496-1.3407 0-.6852.24557-1.06388.42496-1.33999.1407-.21632.2179-.33557.2179-.64028 0-.30514-.0774-.42443-.2176-.64078l-.0003-.00047c-.16011-.24671-.37293-.57484-.41684-1.13018h-1.35732c.02963.16508.09856.2714.20115.42963l.00031.00048c.17936.27643.42493.65507.42493 1.34099 0 .68561-.24557 1.06425-.42525 1.3404l-.00044.0006c-.13986.2159-.21716.3352-.21716.6393 0 .3048.07735.4241.21761.6405l.00031.0004c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0643-.42493 1.3407l-.00075.0012c-.13999.2159-.21717.3349-.21717.6394h-1.28571c0-.6856.24557-1.0642.42493-1.3404l.00075-.0011c.13998-.2159.21717-.335.21717-.6398s-.07718-.4238-.21717-.6397l-.00075-.0012-.00013-.0002c-.17934-.2764-.4248-.6547-.4248-1.3405 0-.6853.24557-1.06391.42493-1.34001l.00006-.0001c.14042-.21626.21786-.33552.21786-.64019 0-.30513-.07735-.42443-.21761-.64077l-.00031-.00047-.00047-.00073c-.15999-.24686-.37239-.57459-.41631-1.12913h-1.35012c.03312.14309.09889.24452.19295.38959l.00031.00048c.17936.27643.42493.65507.42493 1.341 0 .6856-.24557 1.06424-.42525 1.34033-.14047.2163-.21761.3356-.21761.6403 0 .3048.07735.4241.21762.6404l.00031.0005c.17936.2765.42493.6551.42493 1.3407s-.24557 1.0642-.42493 1.3407l-.00027.0004c-.14029.2157-.21766.3347-.21766.6395h-1.2857c0-.6856.24557-1.0642.42492-1.3403l.00007-.0001c.14042-.2163.21786-.3355.21786-.6405 0-.3048-.07735-.4241-.21762-.6405l-.00031-.0004c-.17935-.2765-.42492-.6551-.42492-1.3407 0-.6853.24557-1.06394.42492-1.34005l.00007-.00011c.14042-.21625.21786-.33551.21786-.64017 0-.30513-.07735-.42443-.21762-.64077l-.00031-.00048c-.15616-.24068-.36251-.55884-.41328-1.08982h-1.82161c-.22091 0-.40143-.17968-.38638-.40008.20549-3.00869 2.71124-5.38562 5.77207-5.38562 3.06085 0 5.56655 2.37693 5.77205 5.38562z"
            fill="#9260d2"
            clipPath="url(#leg-section-3)"
          />
        </g>
        <defs>
          <clipPath id="body-clip">
            <rect x="0" y="0" width="16" height="7" />
          </clipPath>
          <clipPath id="leg-section-1">
            <rect x="0" y="7" width="5.33" height="9" />
          </clipPath>
          <clipPath id="leg-section-2">
            <rect x="5.33" y="7" width="5.34" height="9" />
          </clipPath>
          <clipPath id="leg-section-3">
            <rect x="10.67" y="7" width="5.33" height="9" />
          </clipPath>
        </defs>
      </svg>
    ),
    []
  );

  const backgroundLogo = useMemo(
    () => (
      <svg
        className="gelly-bg-logo__svg"
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
    <div className="relative overflow-hidden">
      <style>{`
        :root {
          --gelly: #9260d2;
        }

        .gelly-page {
          color: rgba(255,255,255,0.92);
          position: relative;
        }

        .gelly-logo {
          position: fixed;
          width: 480px;
          height: 480px;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -55%, 0) scale(1);
          opacity: 0.85;
          z-index: 0;
          filter: drop-shadow(0 40px 120px rgba(0,0,0,0.55)) drop-shadow(0 18px 70px rgba(146,96,210,0.38)) blur(0.5px);
          transform-origin: center center;
          transition: z-index 0s linear, filter 600ms ease-out;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .gelly-logo--expanding {
          z-index: 9999;
          animation: gelly-star-wipe 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          filter: drop-shadow(0 100px 200px rgba(0,0,0,0.7)) drop-shadow(0 50px 130px rgba(146,96,210,0.55)) blur(1.5px);
        }

        .gelly-logo__svg {
          width: 100%;
          height: 100%;
        }

        .gelly-hero {
          position: relative;
          z-index: 1;
          transition: opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gelly-logo--expanding ~ .gelly-hero {
          opacity: 0;
          transform: scale(0.98);
        }

        .gelly-subtitle {
          color: rgba(255,255,255,0.82);
          text-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }

        @keyframes gelly-jiggle {
          0%   { transform: translateY(-2px) rotate(0deg) scale(1); }
          10%  { transform: translateY(-3px) rotate(-2deg) scale(1.02); }
          20%  { transform: translateY(-1px) rotate(2deg) scale(0.98); }
          30%  { transform: translateY(-4px) rotate(-1.5deg) scale(1.01); }
          40%  { transform: translateY(-2px) rotate(1.5deg) scale(0.99); }
          50%  { transform: translateY(-3px) rotate(-1deg) scale(1.01); }
          60%  { transform: translateY(-1px) rotate(1deg) scale(0.99); }
          70%  { transform: translateY(-3px) rotate(-0.5deg) scale(1.005); }
          80%  { transform: translateY(-2px) rotate(0.5deg) scale(0.995); }
          90%  { transform: translateY(-2px) rotate(-0.3deg) scale(1.002); }
          100% { transform: translateY(-2px) rotate(0deg) scale(1); }
        }

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
            0 8px 0 0 color-mix(in oklab, var(--gelly), black 40%),
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

        .gelly-cta:hover:not(.gelly-cta--pressed) {
          filter: saturate(1.08);
          animation: gelly-jiggle 0.6s ease-in-out;
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

        .gelly-cta--pressed {
          animation: gelly-squish 520ms cubic-bezier(.2,.9,.2,1) both;
          filter: saturate(1.25);
        }

        .gelly-cta--pressed:hover { 
          animation: none; 
        }

        .gelly-cta--pressed .gelly-cta__label {
          opacity: 0;
          transform: translateY(6px) scale(0.94);
        }

        @keyframes gelly-squish {
          0%   { transform: translateY(-2px) scale(1,1); border-radius: 16px; }
          35%  { transform: translateY(10px) scale(1.08,0.72); border-radius: 28px 28px 18px 18px; }
          62%  { transform: translateY(6px) scale(0.92,1.12); border-radius: 22px 22px 30px 30px; }
          100% { transform: translateY(8px) scale(1,1); border-radius: 26px 26px 34px 34px; }
        }

        @keyframes gelly-star-wipe {
          0% {
            transform: translate3d(-50%, -55%, 0) scale(1);
            opacity: 0.85;
          }
          100% {
            transform: translate3d(-50%, -50%, 0) scale(15);
            opacity: 1;
          }
        }

        .gelly-bg-carousel {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .gelly-bg-row {
          display: flex;
          gap: 4rem;
          width: max-content;
          padding: 2rem 0;
        }

        .gelly-bg-logo {
          width: 80px;
          height: 80px;
          opacity: 0.20;
          flex-shrink: 0;
        }

        .gelly-bg-logo__svg {
          width: 100%;
          height: 100%;
        }

        .gelly-bg-row--left {
          animation: gelly-carousel-left 40s linear infinite;
        }

        .gelly-bg-row--right {
          animation: gelly-carousel-right 45s linear infinite;
        }

        @keyframes gelly-carousel-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes gelly-carousel-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gelly-cta, .gelly-cta:hover, .gelly-cta--pressed { 
            animation: none !important; 
            transition: none !important; 
          }
          .gelly-subtitle { 
            animation: none !important; 
          }
          .gelly-cta__label { 
            transition: none !important; 
          }
          .gelly-logo--expanding { 
            animation: none !important; 
          }
          .gelly-hero { 
            transition: none !important; 
          }
          .gelly-bg-row--left,
          .gelly-bg-row--right {
            animation: none !important;
          }
        }
      `}</style>

      {/* Background Carousel */}
      <div className="gelly-bg-carousel">
        {Array.from({ length: 12 }).map((_, rowIndex) => {
          const isLeft = rowIndex % 2 === 0;
          return (
            <div
              key={rowIndex}
              className={`gelly-bg-row ${isLeft ? "gelly-bg-row--left" : "gelly-bg-row--right"}`}
              style={{
                animationDuration: `${35 + rowIndex * 2}s`,
              }}
            >
              {Array.from({ length: 20 }).map((_, logoIndex) => (
                <div key={logoIndex} className="gelly-bg-logo">
                  {backgroundLogo}
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {Array.from({ length: 20 }).map((_, logoIndex) => (
                <div key={`dup-${logoIndex}`} className="gelly-bg-logo">
                  {backgroundLogo}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Hero Section */}
      <section className="gelly-page flex items-center justify-center min-h-[100dvh]">
        <div
          className={`gelly-logo ${phase === "pressed" ? "gelly-logo--expanding" : ""}`}
          aria-hidden="true"
        >
          {jellySvgLogo}
        </div>
        <div className="gelly-hero mx-auto max-w-4xl text-center flex flex-col gap-6 min-h-[100dvh] justify-center">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-center">
            It's cool to be Gelly
          </h1>
          <p className="gelly-subtitle text-xl md:text-2xl max-w-2xl mx-auto">
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
                className={`gelly-cta ${phase === "pressed" ? "gelly-cta--pressed" : ""}`}
                onClick={() => setPhase("pressed")}
                aria-label="Get wigglin' (start tutorial)"
                disabled={phase === "pressed"}
              >
                <span className="gelly-cta__label">Get jigglin'</span>
              </button>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
