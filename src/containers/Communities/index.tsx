import communitiesLogic from "@/state/communities/logic";
import { CommunityGrid } from "./styles";
import CommunityCard from "../CommunityCard";
import { FC, Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import CommunityError from "@/components/Error";

const Communities: FC<any> = async () => {
  const communities = await communitiesLogic.fetchCommunities();

  return (
    <CommunityGrid>
      {communities
        .filter(
          ({ community, erc4337 }) =>
            !community.hidden && !!erc4337.paymaster_address
        )
        .map((community) => (
          <ErrorBoundary
            key={community.community.alias}
            errorComponent={CommunityError}
          >
            <Suspense
              key={community.community.alias}
              fallback={<div>Loading...</div>}
            >
              <CommunityCard config={community} />
            </Suspense>
          </ErrorBoundary>
        ))}
    </CommunityGrid>
  );
};

export default Communities;
