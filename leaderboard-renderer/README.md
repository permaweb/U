# U Leaderboard

A ReactJS component for "Community Notes" implemented using [Fact Markets](https://facts-protocol.arweave.dev/#/en/main).

## Install

`npm i https://arweave.net/W4q9TGb_FH6ifDV-oYL9K5FtSpmOkMARS6ozl0evwRU`

## Use


```jsx
import LeaderboardApp from 'u-leaderboard';

...

return (
<FactNote tx={"tx goes id"} />

// OR

<FactNote transaction={"transaction object goes here"} />
)

...
```


## Dev

This project uses [Cosmos](https://reactcosmos.org/) and a custom web server to serve Fixtures like storybook. It lets you build components in isolation.  I used cosmos so I could continue to use `esbuild` rather than being forced by tyrants to use `vite` or `webpack` like they allgedly do with Storybook.

Start the app server:

```zsh
npm start
```

Start cosmos:

```zsh
npm run cosmos
```

Open the [App](http://localhost:5000)