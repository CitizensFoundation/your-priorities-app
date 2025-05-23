# Components available for AI work
- server_api/
- webApps/client/

# Folders to ignore for work
dist, ts-out, old, land_use_game, deployment, development

# Coding rules
- Everything is written in Typescript
- Main types are stored in webApps/client/src/*.d.ts, they are shared between the web app and server
- We use the Policy Synth agent library
- We use Lit and Web Components on the client side
- Types *.d.ts are loaded automatically both for server and client code
-- Never change package-lock.json directly
- Use npx tsc to test both server_api and webApps/client to make at least they compile after changes

# Usful links
- Policy Synth types: https://github.com/CitizensFoundation/policy-synth/tree/main/agents/src
