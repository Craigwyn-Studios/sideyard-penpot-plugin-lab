# Sideyard Penpot Plugin Lab

This public repository is a disposable, static-artifact-only HTTPS lab for
Sideyard's Penpot compatibility campaigns. It is not the Sideyard application,
not the production release registry, and not a source distribution channel.

## Public Content Rule

Only a reviewed release may place static files below
`releases/sha256-<64-lowercase-hex>/`. A release consists solely of a Penpot
manifest, static bundles and panel assets, icon, SBOM, release receipt, and
their recorded SHA-256 values.

Never commit any of the following:

- Sideyard application source, customer content, or Penpot documents;
- tokens, private keys, issuer material, credentials, or `.env` files;
- a writer, message bridge, storage, telemetry, or network transport;
- a mutable `latest` alias or rewritten digest path.

## Deployment Gate

The Pages workflow is manual-only. It does nothing while the repository
variable `T25_PAGES_ADMISSION` is absent or not exactly `authorized`.
Setting that variable is a controlled action reserved for a separately
accepted T25 independent admission review. A workflow invocation must also
name an existing content-addressed release directory and its admission-receipt
hash.

The current repository contains no release and Pages is not enabled.
Disposable public HTTPS release lab for Sideyard Penpot no-write compatibility campaigns. No production artifacts or credentials.
