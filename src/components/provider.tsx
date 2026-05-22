"use client";

import { ClerkProvider, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: PropsWithChildren) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Authenticated>
            {children}
          </Authenticated>
          <Unauthenticated>
            <SignInButton />
            <SignUpButton />
          </Unauthenticated>
          <AuthLoading>
            Auth loading...
          </AuthLoading>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}