export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { PossibleBranchesClient } from "./PossibleBranchesClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PossibleBranchesClient />
    </Suspense>
  );
}