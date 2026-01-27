# Skills

Skills are short, procedural playbooks optimized for Copilot/agent execution.

## Core principle
For parity work, **generate artifacts first**, then fix based on the diff report.

### Artifacts live in
- `.temp/parity/` (gitignored)

### Reusable scripts live in
- `scripts/` (versioned, reviewed)

## Skill index
### Scraping
- `scraping.fetch-validate.skill.md`

### Parity
- `parity.capture-prod.skill.md`
- `parity.capture-local.skill.md`
- `parity.extract-ui-text.skill.md`
- `parity.compare-report.skill.md`
- `parity.fix-from-report.skill.md`

## Prompts
- `docs/parity/copilot-parity-prompts.md`

## Visual parity
- Visual review gallery: `node scripts/parity/make_visual_gallery.mjs ".temp/parity/prod" ".temp/parity/local" ".temp/parity/diff/visual-review.html"`
