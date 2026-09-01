# CRM Schema and Export

## 1. CRM principle

The CRM stores a qualified company opportunity and its evidence—not a dossier. Collect the minimum business-relevant fields necessary for a defined outreach purpose.

## 2. Normalized entities

| Entity | Primary fields |
| --- | --- |
| Organization | legal/display name, domain, region, industry, identifiers, parent/subsidiary links |
| Person | public name, current public role, organization link, effective dates, source IDs |
| ContactPoint | channel, value/pattern, status, provenance, lawful-use basis, last verified, suppression |
| Source | canonical URL, publisher, times, access class, extract/hash, evidence level |
| Claim | subject/predicate/object, truth state, scope, evidence links, confidence, review |
| Signal | observed event/metric/change, first/last seen, LAKA variables |
| Hypothesis | mechanism, alternatives, predicted evidence, status |
| Opportunity | intervention, service fit, priority, change state, next test |
| FinancialModel | formulas, tagged inputs, scenarios, model class, overlap group |
| Outreach | selected claim, draft, approvals, send/response/opt-out events |
| AuditRun | scope, registry version, status, owner, retention and quality results |

## 3. Required import columns

The user-requested view:

| Company Name | Domain | Industry | First Name | Last Name | Title | Email Pattern | Primary Technical/PR Gap | Microeconomic/Margin Leak | Estimated Deal Value | Custom Pitch Angle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |

These eleven columns are a presentation/export view. The source system should also retain the governance fields below.

## 4. Governance columns

```text
Organization ID
Person ID
Canonical Domain
Role Verified At
Role Source URL
Contact Status
Contact Source URL
Lawful Use Basis
Jurisdiction
Consent/Relationship Expiry
Suppression Status
Primary Claim ID
Evidence Level
Claim State
Confidence Band
Financial Model Class
Deal Value Low
Deal Value Base
Deal Value High
Currency
Service Fit
Priority Score
Human Review Status
Last Researched At
Next Review At
Retention/Delete At
```

## 5. Contact statuses

| Status | Meaning | Export rule |
| --- | --- | --- |
| published | company/person publicly publishes the business address for this purpose | may export with source and review |
| verified | lawfully verified through an authorized service or direct interaction | may export with verification time/method |
| pattern-only | domain convention inferred from multiple published corporate addresses | export pattern, not a personal email address |
| unknown | no reliable contact point | leave blank; use company contact route or research backlog |
| invalid | bounced/obsolete/wrong person | suppress |
| opted-out | recipient objected/unsubscribed | suppress globally as required |

`Email Pattern` means a pattern such as `{first}.{last}@example.com`, not a guessed address. Never mark a generated address as published or verified.

## 6. Identity resolution

Resolve people using:

- official leadership/team page;
- official filing or press release;
- current company-authored biography;
- reputable professional/public business profile as corroboration.

Require company + role + effective date. Do not merge by name alone. Preserve former roles and source times.

## 7. Deduplication keys

### Organization

1. registry/ticker/legal identifier where available;
2. canonical registrable domain;
3. normalized legal name + jurisdiction;
4. manual review for brands/subsidiaries.

### Person

1. public professional profile/official identifier where lawful;
2. normalized name + organization ID + role period;
3. manual review for common names.

### Opportunity

`organization_id + mechanism + service_family + active_window`

Do not create a new opportunity merely because the same finding came from another source.

## 8. CSV injection protection

Spreadsheet software may interpret cells beginning with `=`, `+`, `-`, `@`, tab, carriage return, or line feed as formulas. Before CSV export:

1. keep trusted numeric fields typed as numbers;
2. for untrusted text beginning with a dangerous prefix, prepend a single quote or use the target CRM's documented safe import method;
3. normalize line endings and remove null bytes;
4. use a standards-compliant CSV writer with quoting;
5. never interpolate untrusted values into formulas;
6. test the actual destination CRM/spreadsheet.

Keep an unsanitized canonical value only in a protected system when necessary, and store the sanitized export separately.

## 9. Data minimization and retention

For each field record:

```yaml
purpose: ""
necessity: required|optional|exclude
lawful_basis: ""
source: ""
retention_period: ""
access_role: ""
delete_or_review_at: ""
```

Remove stale titles, invalid contact data, unsupported allegations, sensitive personal data, and records after their purpose/retention window ends. Propagate opt-outs to every outbound system.

## 10. Deal value

Store deal value separately from cost of inaction and client value:

```text
Client value range = modeled economic benefit
Proposed fee range = price for scoped service
CRM estimated deal value = expected contract value, not the client's alleged loss
```

Do not set `Estimated Deal Value` equal to the high-case ROI. Use the offer's actual pricing/scoping logic and mark TBD until qualified.

## 11. Custom pitch angle grammar

```text
{outreach-eligible public business observation or reviewed corpus calculation}
→ {bounded mechanism}
→ {offered-service fit}
→ {small diagnostic/test}
```

Example:

```text
Public support pages and reviews repeatedly describe setup confusion [sample/window];
test whether onboarding clarity is raising support load before automating the handoff.
```

## 12. Import quality tests

- exact header names and encoding;
- unique organization/person IDs retained where destination permits;
- no formula injection;
- URLs valid and source-linked;
- enum values valid;
- currency and numeric formats normalized;
- blanks used instead of invented values;
- contact status consistent with contact value;
- opt-outs excluded and suppression list checked;
- duplicate threshold and manual-review queue tested;
- sample import into a non-production workspace reviewed before full import.
