# Release Policy

## Ownership

The `Craigwyn-Studios` organization owns this lab. Only a designated Sideyard
release owner may merge a reviewed release or set `T25_PAGES_ADMISSION`.

## Immutable Layout

Every deployed release must use:

```text
releases/sha256-<64-lowercase-hex>/
```

The release directory must include `manifest.json`, a SHA-256 manifest for all
served files, an SBOM, and the independent-admission receipt. Existing digest
directories are append-only. Rollback means explicitly deploying a retained
predecessor digest, never overwriting the current digest path.

## T25 Boundary

This lab may host a static no-write candidate only after its exact hostname,
target custody, artifact hashes, and independent-review authorization have
been recorded. A Pages deployment is not a Penpot installation and does not
authorize any document write, plan issuer, production target, or release
promotion.

## Emergency Response

Unpublish Pages first, then retain the incident record and affected digests.
Do not replace or silently alter a served release path as an emergency fix.
