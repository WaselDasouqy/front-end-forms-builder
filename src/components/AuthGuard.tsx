import React, { ReactNode } from "react"; interface AuthGuardProps { children: ReactNode; } export default function AuthGuard({ children }: AuthGuardProps) { return <>{children}</>; }
