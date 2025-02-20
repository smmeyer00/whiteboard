# Init Checklist

- [x] `npm install` && `npm run dev`
- [x] Create Clerk application in dashboard
- [x] Create PostgreSQL dev instance somewhere (_can run locally if needed_)
- [x] Copy `.env.example` -> `.env.local` and fill in the values
- [ ] https://www.prisma.io/docs/guides/nextjs
  - [x] Tweak starter models in `schema.prisma` as needed
  - [x] Run `npx prisma migrate dev --name init` to push schema changes upstream (will also regenerate client as needed)
  - [x] Update seed.ts w/ relevant seed data, then run `npx prisma db seed`
  - [x] Run prisma studio to view DB via UI with `npx prisma studio`
- [x] _May need to restart TS server if getting errors after above do to all the type changes_
- [ ] Start building!

<br>
<br>

# Some Notes

- All routes protected by default. Edit `src/middleware.ts` to change this.
- Shadcn/ui setup with some defaults. Change base color in `components.json` and theme colors in `src/app/globals.css` if desired
- Most Prisma scaffolding is set up. Should just need to plug in conn string, tweak models, and run migration
