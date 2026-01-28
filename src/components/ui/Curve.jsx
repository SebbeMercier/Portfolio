// Curve.jsx
import React from "react";

export function Curve() {
    return (
        <div className="absolute -left-16 -top-14 w-32 h-20 pointer-events-none opacity-80">
            <svg
                className="w-full h-full"
                viewBox="0 0 120 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M20 40 C40 10, 80 70, 100 40"
                    stroke="url(#curveGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}
