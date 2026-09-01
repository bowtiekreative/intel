# Legal, Ethical, Privacy, and Safety Guardrails

Status: verified against primary sources through 2026-09-01.

This file provides operational controls, not legal advice. Laws, regulator guidance, platform terms, and API policies change. Obtain qualified counsel before production deployment, active security work, or cross-border outreach.

## 1. Governing rule: public does not mean unrestricted

A publicly visible page, profile, email address, document, breach reference, or review is not automatically lawful to scrape, retain, enrich, republish, or use for marketing.

Every collection or outreach operation must resolve:

```yaml
jurisdiction: ""
controller_or_processor: ""
specific_purpose: ""
data_categories: []
sensitivity: ""
source_access_right: ""
copyright_or_license_basis: ""
privacy_basis: ""
outreach_basis: ""
platform_terms_version: ""
robots_snapshot: ""
retention_profile: ""
human_approval: ""
```

If a material field is unknown, fail closed.

## 2. Mandatory control states

Collection:

```text
DISCOVERED → SOURCE_RIGHTS_REVIEWED → PRIVACY_REVIEWED
→ COLLECTABLE → EXTRACTED → MINIMIZED → RETAINED_OR_DELETED
```

Outreach:

```text
RESEARCH_ONLY → CONTACT_BASIS_VERIFIED → MESSAGE_COMPLIANCE_CHECKED
→ HUMAN_APPROVED → AUTHORIZED_OPERATOR_SENDS → SUPPRESSED_OR_FOLLOW_UP_APPROVED
```

The system never autonomously sends. Opt-out, erasure, changed terms, or uncertain legal basis immediately moves the record to `BLOCKED`.

## 3. Canada: CASL outreach controls

A commercial electronic message generally requires consent, identification information, and an unsubscribe mechanism. The sender bears the burden of proving consent. A message asking for consent is itself generally a commercial electronic message, so it cannot be used to manufacture a lawful basis for cold outreach. See the [CRTC CASL FAQ](https://crtc.gc.ca/eng/com500/faq500.htm), [CRTC guidance](https://crtc.gc.ca/eng/com500/guide.htm), and [CASL statute](https://laws-lois.justice.gc.ca/eng/annualstatutes/2010_23/fulltext.html).

Before any Canadian email, text, or platform direct message:

- Record express consent, a specifically valid implied-consent basis, or a reviewed statutory exception.
- Do not treat B2B communication as a blanket exemption.
- For conspicuous-publication reliance, retain evidence that the recipient or organization actually published the address, the publication did not state that unsolicited messages were unwanted, the message is demonstrably relevant to the recipient's business role/functions/duties, and the evidence was current at send time.
- A generated email pattern, MX record, third-party directory entry, or guessed mailbox is not proof of consent or conspicuous publication.
- Identify the sender and, where different, the organization on whose behalf the message is sent.
- Include valid contact information and keep it valid for at least 60 days.
- Provide a clear, no-cost unsubscribe mechanism that remains functional for at least 60 days.
- Apply an unsubscribe without delay and no later than 10 business days.
- Preserve consent/publication, message, unsubscribe, and suppression evidence.
- Do not send an additional message merely to confirm an unsubscribe.

Use the stricter CASL route where Canadian application is plausible. Do not use the limited inquiry exception as a pretext for a sales pitch.

## 4. Canadian privacy controls

PIPEDA applies to many commercial collections, uses, and disclosures of personal information. Alberta, British Columbia, and Quebec have substantially similar private-sector statutes for many intraprovincial activities; PIPEDA continues to matter for federally regulated organizations and many interprovincial or international transfers. See the [OPC PIPEDA summary](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief/).

Operational requirements:

- Identify the purpose before collection.
- Collect only information necessary for that purpose and by fair, lawful means.
- Keep information accurate enough for its intended use.
- Limit use, disclosure, and retention to the recorded purpose.
- Provide access, correction, complaint, withdrawal, and deletion handling.
- Apply safeguards proportionate to sensitivity.
- Maintain an accountable privacy owner and documented policies.

The [OPC fair information principles](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/) provide the operating baseline.

### Publicly available information

The PIPEDA exception is not a general “found online” exception. Information generally must fall within a prescribed category and be used consistently with the purpose for which it was made public. Social-media or professional-profile visibility does not automatically authorize unrelated commercial profiling. See the [OPC interpretation bulletin](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_06_pai/) and [Clearview AI joint investigation](https://www.priv.gc.ca/en/opc-actions-and-decisions/investigations/investigations-into-businesses/2021/pipeda-2021-001/).

PIPEDA's treatment of business contact information used solely to communicate about a person's employment, business, or profession is not permission for broad executive profiling, inferred traits, or unrestricted outreach. CASL remains a separate control.

### Provincial routing

- [Alberta PIPA](https://www.alberta.ca/personal-information-protection-act) governs many provincially regulated private-sector organizations. Check [Alberta OIPC breach guidance](https://oipc.ab.ca/breach-notification/) for notification duties.
- [British Columbia PIPA](https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03063_01) applies to many private organizations; check current [BC OIPC breach resources](https://www.oipc.bc.ca/resources/breach-notification-representatives-of-organizations-and-public-bodies/).
- Quebec's [Private Sector Act](https://www.legisquebec.gouv.qc.ca/en/showdoc/cs/p-39.1) contains privacy-governance, lifecycle, impact-assessment, and confidentiality-incident requirements.

Route by organization, activity, province, and transfer context. Do not encode a one-law-fits-all Canada rule.

## 5. United States: CAN-SPAM controls

CAN-SPAM covers commercial email, including B2B email; it is not limited to bulk campaigns. Consent is not generally the federal prerequisite, but messages must meet content and opt-out rules. See the [FTC compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) and [CAN-SPAM Rule](https://www.ftc.gov/legal-library/browse/rules/can-spam-rule).

Required controls:

- Accurate `From`, `To`, `Reply-To`, domain, and routing information.
- A subject line that truthfully describes the message.
- Clear commercial-message identification where required.
- A valid physical postal address.
- A conspicuous, easy, no-cost opt-out.
- An opt-out mechanism capable of processing requests for at least 30 days.
- Fulfil opt-out requests within 10 business days.
- Do not require additional personal information, login, payment, or a multi-page process to opt out.
- Do not sell or transfer opted-out addresses except to a provider used solely to implement compliance.
- Monitor agencies and vendors sending on the organization's behalf.
- Prohibit address harvesting, dictionary attacks, open-relay abuse, and guessed-mailbox campaigns.

Email-pattern generation stays at organization-pattern level, such as `{first}.{last}@example.com`; it does not silently materialize and message guessed mailboxes.

SMS, automated calls, and telemarketing require separate TCPA, state-law, and Do-Not-Call analysis and are disabled by default.

### US state privacy routing

CAN-SPAM does not replace state privacy law. Business-contact exemptions, applicability thresholds, notice duties, access/correction/deletion rights, sensitive-data rules, sale/share definitions, targeted-advertising opt-outs, universal opt-out signals, and processor contracts vary by state and change over time. Before collecting or activating a US record, resolve the relevant state(s) and load a current state-law policy pack. If the state or applicability is unresolved, keep the record research-blocked and do not sell, share, target, or contact from it.

## 6. EU/EEA: GDPR and ePrivacy controls

Determine whether GDPR territorial scope applies, including where an organization outside the EU offers goods/services to or monitors individuals in the EU. Start with the [European Commission data-protection overview](https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en).

For each prospect or executive record:

- Record an Article 6 legal basis.
- If relying on legitimate interests, document purpose, necessity, less-invasive alternatives, reasonable expectations, impact, and safeguards. Direct marketing is not automatically lawful merely because it may represent an interest; see the [EDPB legitimate-interest guidelines](https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202401_legitimateinterest_en.pdf).
- Avoid Article 9 special-category data unless counsel approves a specific exception and safeguards.
- Provide Article 14 information when data came from another source, generally by first communication or within one month.
- Record the source, including whether it was publicly accessible.
- Honour access, correction, restriction, deletion, portability, and objection requests within the applicable period.
- Stop direct-marketing processing, including related profiling, when the person objects.
- Perform transfer analysis and document adequacy, safeguards, or another lawful mechanism where data leaves the EEA.

Use the [European Commission GDPR principles](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en) and [rights-request guidance](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/dealing-requests-individuals_en).

Third-party or purchased lists require verification that the supplier obtained and may transfer the data for the intended marketing purpose, that the list is current, required notices are provided, and objectors are excluded. See the [European Commission marketing-list guidance](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data/can-data-received-third-party-be-used-marketing_en).

Electronic outreach must also satisfy [ePrivacy Directive Article 13](https://eur-lex.europa.eu/eli/dir/2002/58/oj/eng) and the recipient country's implementing law. B2B treatment varies by member state. Route by recipient country and channel.

Cold-email tracking pixels, cross-site identifiers, cookie-based prospect surveillance, and covert engagement scoring are disabled by default.

## 7. Platform, API, and robots controls

Maintain a versioned source-rights registry:

```yaml
source_id: ""
access_method: official_api|feed|public_page|manual_only
terms_url: ""
terms_effective_date: ""
commercial_use_allowed: true|false|conditional|unknown
automation_allowed: true|false|conditional|unknown
permitted_purposes: []
redistribution_allowed: true|false|conditional|unknown
retention_limit: ""
attribution_required: ""
deletion_requirement: ""
rate_limit: ""
robots_snapshot_hash: ""
last_reviewed_at: ""
next_review_at: ""
decision: allow|conditional|manual_only|block
```

Rules:

- Prefer official APIs, feeds, data exports, and open datasets.
- Respect authentication boundaries, paywalls, CAPTCHAs, rate limits, API quotas, and robots directives.
- Do not use logged-in consumer sessions to bypass API or automation restrictions.
- Do not rotate identities, proxies, accounts, or user agents to evade controls.
- A missing robots prohibition is not permission; a robots prohibition blocks automated collection unless the publisher separately authorizes it.
- `robots.txt` is a crawler protocol, not an access-control or licensing grant; see [RFC 9309](https://www.rfc-editor.org/info/rfc9309/).
- Re-evaluate the connector when terms change.
- Delete or refresh platform data when contractually required.

Primary contractual references include the [LinkedIn User Agreement](https://www.linkedin.com/legal/user-agreement), [Reddit Data API Terms](https://redditinc.com/policies/data-api-terms), [YouTube API Terms](https://developers.google.com/youtube/terms/api-services-terms-of-service), and [Meta Platform Terms](https://developers.facebook.com/terms/dfc_platform_terms/).

## 8. Copyright and database rights

Facts and ideas may receive different treatment from original expression, compilations, photographs, video, audio, software, and protected databases. Do not assume fair use, fair dealing, or text-and-data-mining exceptions apply.

- Retain the canonical URL, publisher, timestamps, content hash, structured fact, and only the shortest evidentiary excerpt necessary unless fuller retention is authorized.
- Do not republish complete articles, reviews, reports, images, audio, or videos.
- Do not build a substitute publication from systematic extraction.
- Do not remove attribution or rights metadata.
- Do not circumvent technical protection measures.
- Do not train or fine-tune models on collected content unless content and model-use rights are recorded.
- Keep full-page captures access-controlled and short-lived unless permission or a defensible preservation need exists.
- Review EU database rights before systematic or repeated extraction.

Primary references: [Canada Copyright Act](https://laws-lois.justice.gc.ca/eng/acts/C-42/), [United States Copyright Act](https://www.copyright.gov/title17/), and [EU Database Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A31996L0009).

## 9. Security research and responsible disclosure

The default security mode is passive, read-only observation. Without explicit written authorization and rules of engagement, prohibit:

- port or vulnerability scanning;
- exploit validation;
- authentication attempts;
- credential stuffing, password spraying, or leaked-credential use;
- SMTP `VRFY` or `RCPT` mailbox probing;
- bypassing access controls;
- downloading more exposed data than minimally necessary to recognize an issue;
- persistence, modification, deletion, or denial-of-service activity.

A `security.txt` file provides reporting information but does not authorize testing. See [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116.html). Any active assessment belongs in a separate specialist engagement with written scope and rules of engagement consistent with [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final); it is never activated inside this system.

When a credible vulnerability or exposed secret is encountered:

1. Stop further access.
2. Record only a redacted type, location, timestamp, and non-reversible fingerprint—never the secret, credential, token, or private payload itself—unless a separate authorized incident-response process explicitly requires and controls it.
3. Keep exploit details out of pitches and CRM.
4. Locate `/.well-known/security.txt` or the vulnerability-disclosure policy.
5. Follow its scope, encryption, contact, and timing requirements.
6. Report privately and factually.
7. Coordinate any publication through the authorized process.

Use [CISA's vulnerability disclosure policy template](https://www.cisa.gov/vulnerability-disclosure-policy-template) as a process reference.

## 9A. Competition and antitrust guardrail

Competitor intelligence supports independent, unilateral decisions from lawful public evidence. Never request, exchange, infer from private coordination, or optimize around competitors' nonpublic current/future prices, output, capacity, customers, bids, wages, territories, or strategy. Do not use the system to signal, recommend, or facilitate coordinated pricing, market allocation, bid coordination, or collective restraint. Route trade-association data exchanges, algorithmic pricing, competitor communications, and concentrated-market pricing recommendations to qualified competition counsel before use.

## 10. Data minimization and prohibited enrichment

Do not collect or infer, unless a separately approved legal and ethical use case requires it:

- health, disability, biometric, genetic, racial, ethnic, religious, sexual-orientation, union-membership, or political data;
- immigration status;
- precise personal location;
- family-member details;
- home addresses or personal telephone numbers;
- financial distress or private financial records;
- information about minors;
- passwords, credential contents, breach dumps, authentication tokens, or session data.

Prefer organization-level and role-level evidence over personal profiling. Executive messaging analysis concerns public professional statements and decisions, not psychological diagnosis.

Sentiment models, lead scores, and economic estimates never become unreviewed facts. Preserve sampling limitations, counterevidence, confidence, and the distinction between fact, inference, hypothesis, and model.

## 11. Retention, deletion, correction, and suppression

Every personal-data record has a purpose owner and `delete_at` or `review_at` value.

- Raw captures receive the shortest retention period.
- Structured evidence is retained only while necessary and lawful.
- Embeddings, graph edges, summaries, caches, reports, exports, and CRM projections inherit the subject identifier and deletion policy.
- Backups expire or support documented deletion replay.
- Recollection must not resurrect erased or suppressed records.
- Corrections propagate to claims, scores, reports, and CRM.
- Deletion produces a receipt without retaining the deleted content.
- Legal holds are explicit, narrow, approved, and time-bounded.

PIPEDA states that information no longer required should be destroyed, erased, or anonymized; see [OPC retention guidance](https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/appropriate-handling-of-personal-information/gd_rd_201406/).

Maintain a separate suppression service. Keep only the minimum token or keyed fingerprint, scope, reason, and timestamp needed to prevent renewed contact. Suppression data cannot be reused for marketing or enrichment.

## 12. Incident response

Encrypt personal and security-sensitive data in transit and at rest. Apply tenant isolation, least privilege, MFA, secrets management, export controls, access logs, and monitored administrative actions.

```text
CONTAIN → PRESERVE MINIMAL EVIDENCE → ASSESS JURISDICTIONS AND HARM
→ NOTIFY PRIVACY/SECURITY OWNER → REQUIRED NOTICE → REMEDIATE
→ DOCUMENT → RETENTION/DELETION REVIEW
```

Under PIPEDA, report breaches presenting a real risk of significant harm, notify affected individuals, and retain records of all breaches. See [OPC mandatory-breach guidance](https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/privacy-breaches-at-your-business/gd_pb_201810/). GDPR, Alberta, Quebec, and other regimes have separate thresholds and deadlines; route incidents immediately rather than assuming one universal standard.

## 13. Ethical authority-first outreach

Permitted authority comes from relevance and evidence, not surveillance theater.

- Cite public professional evidence.
- Use neutral language such as “public evidence suggests” or “our model estimates.”
- Show assumptions and ranges for dollar estimates.
- Do not claim a company has leaked credentials, no MFA, or an exploitable vulnerability without an authorized confirmation process.
- Never reveal sensitive security evidence in a subject line.
- Send vulnerabilities to security channels, not as leverage in sales.
- Do not impersonate, manufacture urgency, imply endorsement, or conceal commercial intent.
- Do not weaponize customer complaints, employee reviews, personal hardship, or reputational allegations.
- Require corroboration and legal review before publishing potentially defamatory misconduct, fraud, safety, or regulatory allegations.
- Apply frequency caps and stop after objection, opt-out, or reasonable non-response.
- Preserve a clear correction and challenge path.

## 14. Mandatory human-review triggers

Escalate and block automation for:

- uncertain source rights or changed terms;
- sensitive/special-category data, minors, or private family information;
- breach, dark-web, credential, or vulnerability evidence;
- active security testing;
- logged-in or restricted-source collection;
- a guessed address proposed for outreach;
- no documented outreach basis;
- cross-border transfer uncertainty;
- automated adverse scoring or sensitive profiling;
- legal, regulatory, misconduct, or defamatory allegations;
- requests to evade robots, rate limits, CAPTCHAs, consent, opt-out, or platform enforcement.

External outreach is at least LAKA execution impact `I4`. Security, policy, or legal-boundary actions are `I6`. Both require explicit human approval; I6 also requires documented authorization or counsel review.

## 15. Pre-release checklist

- [ ] Jurisdiction and channel are resolved.
- [ ] Source rights, robots, terms, and commercial-use status are current.
- [ ] Purpose and privacy basis are recorded.
- [ ] Collection is minimized and retention has an end state.
- [ ] No prohibited/sensitive enrichment enters prompts, embeddings, reports, or CRM.
- [ ] Contact provenance and outreach basis are independently verified.
- [ ] Message identity, postal/contact information, and unsubscribe controls pass.
- [ ] Suppression is checked at approval and again at send time.
- [ ] A human approves the exact message version.
- [ ] Correction, objection, deletion, and incident routes are operational.

## 16. Jurisdiction coverage boundary

The Canada, United States, and EU/EEA controls above are illustrative baselines, not an exhaustive global legal map. The UK GDPR/PECR, Australia Privacy Act/Spam Act, Brazil LGPD, and other national, state, provincial, and sectoral regimes can impose different requirements. No unprofiled region or channel is activated until a current jurisdiction-specific legal pack is loaded and approved.
