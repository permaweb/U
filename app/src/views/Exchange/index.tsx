import { URLTabs } from "components/organisms/URLTabs";

import { URLS } from "helpers/config";

export default function Exchange() {
  return (
    <URLTabs
      className={"exchange-wrapper"}
      tabs={URLS.exchange}
      activeUrl={URLS.exchange[0]!.url}
    />
  );
}
