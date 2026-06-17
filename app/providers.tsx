"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CustomCursor } from "@/components/effects/custom-cursor";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <CustomCursor />
            {children}
        </SessionProvider>
    );
}
