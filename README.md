# Animal Adoption

An animal-adoption coursework application with an Express API and relational database.

**Built with:** Node.js · Express · MySQL · HTML/CSS/JavaScript

**Subject results:** ADEV: A · DBAV: A  
*Subject grades; individual project marks were not supplied.*

## What it includes

- Complete own-student frontend and server submission.
- MySQL schema/seed SQL, dependency lockfile and image assets.
- Project specification, completed report and API documentation.

## Project status

Complete coursework source; administrative authorisation needs improvement. Add server-side authorisation to administrative mutation routes before exposing a live deployment. No database-backed end-to-end test was performed.

## Folder guide

| Folder | Contents |
| --- | --- |
| [`src/`](src/) | Original implementation, assets and project configuration |
| [`docs/`](docs/) | Available specifications, proposals, reports, diagrams and project context |

## Run or open

Import `src/project2.sql` into MySQL and configure `src/db-connections.js` with your own connection values. Its password has been replaced with a placeholder.

```text
cd src
npm install
node server.js
```

Use the local address/port configured by the server.

## Supporting documents

| File | Format |
| --- | --- |
| [adev-dbav-project-2-api-implementation-documentation.pdf](docs/adev-dbav-project-2-api-implementation-documentation.pdf) | PDF |
| [adev-dbav-project-2-report.docx](docs/adev-dbav-project-2-report.docx) | DOCX |
| [adev-dbav-project-2-specification.pdf](docs/adev-dbav-project-2-specification.pdf) | PDF |
| [project-context.md](docs/project-context.md) | MD |

## Notes

API keys and demonstration passwords detected in the portfolio copies use
placeholders. Configure your own services before running integrations. Original
source credits and bundled third-party licences remain with their files.
