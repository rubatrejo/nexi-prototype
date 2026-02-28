"use client";

/* eslint-disable react/no-unknown-property */

// NEXI X-icon (official SVG — 4 paths, windmill shape)
export function NexiIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  const scale = size / 121.233;
  const w = 137.993 * scale;
  return (
    <svg width={w} height={size} viewBox="0 0 137.993 121.233" fill={color}>
      <path d="M71.349,87.094A21.555,21.555,0,0,1,60.563,84.2L43.631,101.134a45.086,45.086,0,0,0,55.823-.289l-16.9-16.9a21.556,21.556,0,0,1-11.207,3.145" transform="translate(-2.48 -4.771)" />
      <path d="M71.352,16.305a45.007,45.007,0,0,0-27.674,9.5L60.614,42.742a21.555,21.555,0,0,1,21.9.255l16.9-16.9a45.032,45.032,0,0,0-28.06-9.79" transform="translate(-2.482 -0.926)" />
      <path d="M115.72,78.45a44.824,44.824,0,0,0-.011-35.648L143.276,0,109.944,33.015c-.024-.031-.044-.064-.068-.094L92.944,49.852a21.576,21.576,0,0,1,.03,21.524v0l-.031,0,3.584,3.55,13.381,13.381c.019-.024.035-.051.054-.075l33.313,33Z" transform="translate(-5.282)" />
      <path d="M27.556,78.45A44.823,44.823,0,0,1,27.567,42.8L0,0,33.332,33.015c.024-.031.044-.064.068-.094L50.332,49.852a21.576,21.576,0,0,0-.03,21.524v0l.031,0-3.584,3.55L33.367,88.312c-.019-.024-.035-.051-.054-.075L0,121.233Z" />
    </svg>
  );
}

// NEXI full logo (official SVG with wordmark)
export function NexiLogoFull({ height = 28, color = "currentColor" }: { height?: number; color?: string }) {
  const scale = height / 121.75;
  const w = 288.935 * scale;
  return (
    <svg width={w} height={height} viewBox="0 0 288.935 121.75" fill={color}>
      <circle cx="5.325" cy="5.325" r="5.325" transform="translate(46.886 71.055)"/>
      <g transform="translate(263.791 3.055)">
        <rect width="25.144" height="46.812" transform="translate(0 71.883)"/>
        <rect width="25.144" height="46.738"/>
      </g>
      <path d="M139.455,148.588H114.311V65.575c0-2-3-7.026-4.437-8.5-9.281-9.466-29.951-4.03-29.951,9.984v81.533H53.3V71.122c.185-24.774,16.2-42.856,41.229-44.187,27.659-1.479,43.484,14.014,44.964,41.229v80.424Z" transform="translate(-53.3 -26.837)"/>
      <path d="M369.4,34.5V60.495H337.045a10.494,10.494,0,0,0-10.5,10.5h0a10.494,10.494,0,0,0,10.5,10.5h17.527v25.181H337.489a10.9,10.9,0,0,0-10.908,10.908h0a10.9,10.9,0,0,0,10.908,10.908H369.4v24.922H334.9a33.495,33.495,0,0,1-33.5-33.5V66.928A32.422,32.422,0,0,1,333.828,34.5H369.4Z" transform="translate(-209.661 -31.667)"/>
      <g transform="translate(165.47 3.055)">
        <path d="M593.279,35.1H564.991L547.021,64.053,529.087,35.1H500.8l32.1,56.389-32.1,62.232h28.287l17.934-34.795,17.971,34.795h28.287l-32.1-62.232Z" transform="translate(-500.8 -35.1)"/>
      </g>
    </svg>
  );
}

// Powered by TrueOmni (official SVG logo)
export function PoweredByTrueOmni({ variant = "dark" }: { variant?: "dark" | "white" }) {
  const fill = variant === "white" ? "#FFFFFF" : "#181818";
  const blueDot = variant === "white" ? "#FFFFFF" : "#079ee2";
  return (
    <svg width={variant === "white" ? 130 : 171} height={variant === "white" ? 13 : 17} viewBox="0 0 342.236 34" style={{ opacity: variant === "white" ? 1 : 0.5 }}>
      <g transform="translate(-6097.471 603.783)">
        <g transform="translate(6223.282 -608.781)">
          <path d="M242.013,49.582a9.423,9.423,0,0,0-3.886.838,4.9,4.9,0,0,0-2.46,2.406v11.3h-4.778V45.446h4.385V49.44a8.514,8.514,0,0,1,1.177-1.729,9.046,9.046,0,0,1,1.462-1.337A6.765,6.765,0,0,1,239.5,45.5a4.379,4.379,0,0,1,1.551-.3h.588a1.944,1.944,0,0,1,.374.035Z" transform="translate(-159.04 -31.132)" fill={fill}/>
          <path d="M283.4,65.038a5.3,5.3,0,0,1-4.385-1.854,8.594,8.594,0,0,1-1.5-5.491V46H282.3v10.66q0,4.314,3.1,4.314a4.906,4.906,0,0,0,2.692-.838,6.023,6.023,0,0,0,2.121-2.549V46h4.778V59.191a1.678,1.678,0,0,0,.267,1.07,1.168,1.168,0,0,0,.874.357v4.064a10.183,10.183,0,0,1-1.194.178c-.321.023-.612.036-.874.036a3.44,3.44,0,0,1-2.086-.588,2.315,2.315,0,0,1-.945-1.622l-.107-1.5a7.966,7.966,0,0,1-3.209,2.888,9.653,9.653,0,0,1-4.314.963" transform="translate(-191.16 -31.685)" fill={fill}/>
          <path d="M357.823,64.328a10.373,10.373,0,0,1-4.064-.766,9.167,9.167,0,0,1-5.081-5.152,9.833,9.833,0,0,1-.7-3.672,10.4,10.4,0,0,1,.677-3.762,9.182,9.182,0,0,1,1.961-3.1,9.36,9.36,0,0,1,3.12-2.121,10.387,10.387,0,0,1,4.118-.785,10.13,10.13,0,0,1,4.082.785,9.4,9.4,0,0,1,3.066,2.1,8.958,8.958,0,0,1,1.925,3.066,10.221,10.221,0,0,1,.66,3.637q0,.464-.018.891a3.664,3.664,0,0,1-.089.713h-14.44a5.54,5.54,0,0,0,.535,1.961,4.8,4.8,0,0,0,2.638,2.389,5.039,5.039,0,0,0,1.783.321,5.512,5.512,0,0,0,2.692-.7,3.682,3.682,0,0,0,1.729-1.836l4.1,1.141a8.334,8.334,0,0,1-3.3,3.512,10.223,10.223,0,0,1-5.4,1.373m4.849-11.266a4.971,4.971,0,0,0-1.551-3.369,4.867,4.867,0,0,0-6.614.018,4.893,4.893,0,0,0-1.052,1.462,5.146,5.146,0,0,0-.481,1.89Z" transform="translate(-239.696 -30.975)" fill={fill}/>
          <path d="M433.147,49.785a10.466,10.466,0,0,1-4.813-1.105,12.425,12.425,0,0,1-3.744-2.888,12.9,12.9,0,0,1-2.424-4.1,13.588,13.588,0,0,1-.855-4.742,13.16,13.16,0,0,1,.909-4.849,13.561,13.561,0,0,1,2.5-4.1,11.943,11.943,0,0,1,3.762-2.834,10.665,10.665,0,0,1,4.706-1.052,10.441,10.441,0,0,1,4.831,1.123,12.135,12.135,0,0,1,3.744,2.941,13.6,13.6,0,0,1,2.406,4.118,13.407,13.407,0,0,1-2.549,13.62,12.077,12.077,0,0,1-3.761,2.817,10.666,10.666,0,0,1-4.706,1.052M423.128,36.95a12.181,12.181,0,0,0,.731,4.189,11.3,11.3,0,0,0,2.068,3.565,10.174,10.174,0,0,0,3.191,2.478,8.953,8.953,0,0,0,4.064.927,8.736,8.736,0,0,0,4.118-.963,10.053,10.053,0,0,0,3.138-2.549,12.086,12.086,0,0,0,1.978-11.837,11.6,11.6,0,0,0-2.085-3.566,10.323,10.323,0,0,0-3.156-2.478,8.664,8.664,0,0,0-3.993-.927,8.839,8.839,0,0,0-4.136.962,10.186,10.186,0,0,0-3.173,2.549,11.71,11.71,0,0,0-2.032,3.583,11.989,11.989,0,0,0-.713,4.064" transform="translate(-290.204 -16.611)" fill={fill}/>
          <path d="M539.289,64.287h-1.782V53.947a9.766,9.766,0,0,0-1.088-5.205,3.7,3.7,0,0,0-3.334-1.676,5.631,5.631,0,0,0-2.175.428,6.588,6.588,0,0,0-1.889,1.194,7.7,7.7,0,0,0-1.48,1.818,9.563,9.563,0,0,0-.98,2.335V64.287h-1.783V53.947a9.886,9.886,0,0,0-1.069-5.223,3.667,3.667,0,0,0-3.316-1.658,5.714,5.714,0,0,0-2.157.41,6.361,6.361,0,0,0-1.872,1.177,8.462,8.462,0,0,0-1.515,1.818,8.79,8.79,0,0,0-1.016,2.335V64.287H512.05V45.747h1.675v4.421a9.028,9.028,0,0,1,3-3.494,7.183,7.183,0,0,1,4.1-1.248,5.308,5.308,0,0,1,3.815,1.39,5.865,5.865,0,0,1,1.747,3.637q2.638-5.027,7.273-5.027a4.66,4.66,0,0,1,4.332,2.157,11.741,11.741,0,0,1,1.3,6.044Z" transform="translate(-352.707 -31.29)" fill={fill}/>
          <path d="M632.611,64.287h-1.782V53.947a10.3,10.3,0,0,0-1.016-5.241,3.516,3.516,0,0,0-3.227-1.64,6.694,6.694,0,0,0-2.335.428,7.9,7.9,0,0,0-2.157,1.212,8.859,8.859,0,0,0-1.747,1.836,7.573,7.573,0,0,0-1.105,2.264V64.287h-1.782V45.747h1.676v4.421a8.712,8.712,0,0,1,1.408-1.943,8.874,8.874,0,0,1,1.89-1.5,9.52,9.52,0,0,1,2.228-.963,8.728,8.728,0,0,1,2.425-.339,4.556,4.556,0,0,1,4.279,2.121,12.118,12.118,0,0,1,1.248,6.079Z" transform="translate(-425.314 -31.29)" fill={fill}/>
          <rect width="1.782" height="18.54" transform="translate(212.858 14.457)" fill={fill}/>
          <path d="M173.444,26.379a2.563,2.563,0,1,1-2.563-2.563,2.563,2.563,0,0,1,2.563,2.563" transform="translate(-115.941 -16.405)" fill={blueDot}/>
          <path d="M684.14,27.316a2.563,2.563,0,1,1-2.563-2.563,2.563,2.563,0,0,1,2.563,2.563" transform="translate(-467.715 -17.05)" fill={blueDot}/>
          <path d="M203.307,29h-8.093V50h-4.885V29h.047V24.688h12.931Z" transform="translate(-131.102 -17.006)" fill={fill}/>
        </g>
        <text transform="translate(6097.471 -576.783)" fill={fill} fontSize="28" fontFamily="Montserrat, sans-serif" fontWeight="500"><tspan x="0" y="0">Powered by</tspan></text>
      </g>
    </svg>
  );
}

// Common UI icons
export function ChevronRight({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ArrowLeft({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function HomeIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  );
}

export function CheckCircle({ size = 48, color = "#22c55e" }: { size?: number; color?: string }) {
  return (
    <div style={{ width: size * 1.5, height: size * 1.5, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow ring */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        opacity: 0.3,
      }} />
      {/* Inner filled circle with check */}
      <div style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 24px ${color}40`,
      }}>
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    </div>
  );
}

export function AlertTriangle({ size = 48, color = "var(--error)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function SearchIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
