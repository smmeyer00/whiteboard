# TODO

- [ ] Build out a sidebar. Simple for now, account avatar and access from the bottom, documents and controls at the top
- [ ] Integrate ~~excalidraw~~ tldraw basic usage
- [ ] Integrate loading, saving, etc.. (CRUD) ops w/ excalidraw docs
- [ ] Come up with more todos for features lol
- [ ] Setup clerk webhook to listen for user creations, and write them to our DB

  - [ ] Skip for now as ngrok required for local testing. DO BEFORE PROD DEPLOY

- [x] Add custom sign-in and sign-up pages instead of used Clerk-hosted options. Custom pages will follow the custom clerk provider appearance
- [x] Figure out DB situation; either use _prisma_ or ~~drizzle~~ (whichever has better resources, maybe prisma). Figure out where to host (can run postresql in docker locally for dev I believe, then setup real hosted instance and swap pg_url for prod deploy)
  - [x] edit: use whiteboard-dev DB hosted in vercel, and use prima for ORM
