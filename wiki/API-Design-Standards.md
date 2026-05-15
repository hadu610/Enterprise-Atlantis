# API Design Standards

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** Dev Agent · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

Every external and internal API on the platform follows these conventions. Consistency is non-negotiable: integration partners, customers, and the Dev Agent itself all consume APIs faster when their shape is predictable.

We follow [RFC 9457 (Problem Details)](https://datatracker.ietf.org/doc/html/rfc9457), [Microsoft's REST guidelines](https://github.com/microsoft/api-guidelines), and the [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) specification as our baseline.

---

## 1. Style choice — REST first, gRPC for hot service-to-service paths

- **External APIs (customer-facing, integration partners)** — REST + JSON over HTTPS.
- **Internal service-to-service in high-throughput paths** — gRPC.
- **GraphQL** — explicitly not at this stage. Adds caching/perf complexity without sufficient benefit for our shape.

## 2. URL design

- Resource paths use **plural nouns**: `/v1/customers`, `/v1/agents`, `/v1/tickets`.
- Sub-resources are nested at most one level: `/v1/customers/{id}/contracts`.
- Verbs in URLs are forbidden, with one exception: **actions** that don't fit CRUD, prefixed `/actions/`: `/v1/tickets/{id}/actions/approve`.
- Kebab-case for multi-word path segments: `/v1/data-bridge`.
- IDs are opaque strings, prefixed by entity kind (see [Unified Entity Model](Unified-Entity-Model)): `person:abc123`, `ticket:xyz789`.

## 3. HTTP methods

| Method | Use | Idempotent |
|---|---|---|
| `GET` | Retrieve a resource or collection | ✓ |
| `POST` | Create a resource OR trigger an action | ✗ (unless `Idempotency-Key`) |
| `PUT` | Replace a resource | ✓ |
| `PATCH` | Partial update | ✗ |
| `DELETE` | Remove a resource | ✓ |

No method overloading. `POST /resource/delete` is forbidden.

## 4. Status codes

| Range | Use |
|---|---|
| `2xx` | Success |
| `3xx` | Redirect (rare; only `301` for permanent moves and `304` for caching) |
| `4xx` | Client error |
| `5xx` | Server error |

Specific:

- `200 OK` — success with body
- `201 Created` — resource created, `Location` header points at it
- `202 Accepted` — async; body contains operation ID for polling
- `204 No Content` — success, no body (typical for `DELETE`)
- `400 Bad Request` — request malformed or failed validation
- `401 Unauthorized` — no/invalid credentials
- `403 Forbidden` — authenticated but not permitted
- `404 Not Found` — resource does not exist (or not visible to caller)
- `409 Conflict` — version mismatch, duplicate, or business-rule violation
- `422 Unprocessable Entity` — well-formed but semantically invalid
- `429 Too Many Requests` — rate limited; `Retry-After` header required
- `500 Internal Server Error` — unexpected failure
- `503 Service Unavailable` — temporary inability; `Retry-After` header required

**Forbidden:** returning `200 OK` with an error in the body. Bake the truth into the status code.

## 5. Error responses

All errors follow [RFC 9457 Problem Details](https://datatracker.ietf.org/doc/html/rfc9457):

```json
{
  "type": "https://errors.atlantis.os/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "The 'work_jurisdiction' field is required for employee.profile changes.",
  "instance": "/v1/employees/person:abc123",
  "trace_id": "01HXY...",
  "fields": [
    { "path": "work_jurisdiction", "code": "required" }
  ]
}
```

- `type` is a stable URI documenting the error class.
- `trace_id` lets a customer reference the failure in support.
- Field-level errors are an extension; never invent ad-hoc shapes.

## 6. Pagination

- **Cursor-based, not offset-based.** Cursors are opaque strings; clients don't construct them.
- Request: `?limit=50&cursor=<opaque>`
- Response:

```json
{
  "data": [...],
  "next_cursor": "eyJ...",
  "has_more": true
}
```

- Default `limit` 50; maximum 200. Out-of-range returns `400`.

## 7. Filtering, sorting, field selection

- Filtering: `?status=active&created_after=2026-01-01`. Documented per endpoint.
- Sorting: `?sort=created_at:desc,name:asc`. Whitelisted fields only.
- Field selection (sparse responses): `?fields=id,name,status`. Stable field names — never let a UI dictate API shape.

## 8. Versioning

- Major version in the URL: `/v1/`, `/v2/`.
- No breaking changes within a major version — period.
- Deprecation: minimum 12-month notice in the `Sunset` header + email to customer admins.
- Old major versions kept for 12 months after the next major is GA.

Breaking change examples:

- Removing a field
- Changing a field's type or semantics
- Tightening validation
- Renaming an endpoint

Non-breaking (allowed):

- Adding optional fields
- Adding new endpoints
- Loosening validation
- Adding new enum values **only with documented forward-compatibility expectations**

## 9. Authentication

- **OAuth 2.0 + OIDC** for human users.
- **API keys** for server-to-server, scoped per integration.
- **Service-to-service inside the platform** — mTLS + short-lived JWT (see [Security and Data Policy § 4](Security-and-Data-Policy#4-identity-and-access-management)).
- **Agent identities** — see [Action Risk Classification](Action-Risk-Classification).

API keys are revocable and rotatable. Customers can issue and revoke keys via the console.

## 10. Authorisation

- Permissions are scope-based, not role-based at the API layer. The agent identity layer maps roles → scopes; the API gateway checks scopes.
- Every endpoint declares its required scope(s) in its OpenAPI spec.
- Forbidden actions return `403` with the `type: insufficient_scope` problem.

## 11. Rate limiting

- Per-API-key and per-IP rate limits.
- Headers always returned:
  - `X-RateLimit-Limit` — limit for the window
  - `X-RateLimit-Remaining` — calls remaining
  - `X-RateLimit-Reset` — UTC epoch seconds when the window resets
  - `Retry-After` — on `429`, seconds to wait
- Per-tenant overrides via plan tier.

## 12. Idempotency

- All non-idempotent endpoints accept `Idempotency-Key` request header.
- Implementation: store request hash + response for 24 hours keyed by `(tenant, key)`. A repeat returns the original response.
- Agents always send keys; SDKs default to generating them.

## 13. OpenAPI 3.1 specs are the source of truth

- Every API has a published OpenAPI spec.
- Clients are generated, not hand-rolled.
- The spec is in the same repo as the implementation; spec-and-impl drift is a PR-blocking lint failure.
- Customer-facing docs are generated from the spec.

## 14. Webhooks

- Customers receive event notifications via webhooks at customer-configured URLs.
- Payloads are signed with HMAC-SHA256; signature in `X-Atlantis-Signature` header.
- Delivery: at-least-once with exponential backoff (up to 24h).
- Idempotency on the customer side is the customer's responsibility — payloads carry `event_id` for dedup.
- Webhook secret rotation supported without downtime.

## 15. Events (internal eventing for orchestration)

- Event envelope:

```json
{
  "event_id": "evt:01HX...",
  "event_type": "ticket.created",
  "schema_version": 1,
  "tenant_id": "tenant:abc",
  "occurred_at": "2026-05-15T12:34:56.789Z",
  "trace_id": "01HX...",
  "data": { ... }
}
```

- Event types versioned independently of API; consumers handle multiple versions during transitions.
- Topic naming: `<domain>.<entity>.<action>` (e.g. `agent.ticket.created`).

## 16. Backward / forward compatibility

- Adding optional fields: forward-compatible (old clients ignore).
- Adding required fields: breaking — bump major version.
- Adding enum values: must be documented; clients are expected to handle `unknown` enum gracefully.
- Removing fields: breaking.
- Changing semantics of a field: breaking.

## 17. Public API exposure principles

- An API endpoint is internal until proven otherwise. Promoting to public is a deliberate decision, not a default.
- Public APIs require: documented stability, eval / contract tests, SLO definition, customer-facing changelog.

## 18. Forbidden

- Returning `200` with an error in the body
- Hard-coded request/response shapes outside the OpenAPI spec
- Endpoints that mix verbs with nouns (`/getUser`, `/createTicket`)
- Trailing slashes inconsistency (we use trailing slashes consistently or not — choose per service and document)
- API keys logged in plaintext
- Free-form date strings — always ISO 8601 UTC

---

## When to revisit

- A customer integration partner reports systematic friction tracing to API shape.
- A new HTTP standard (or revision to one we follow) lands and our practices fall behind.
- The Dev Agent's API-related PR rejection rate suggests calibration drift.
- A new protocol (e.g. gRPC over WebTransport) becomes a clear advantage on a hot path.

---

## Cross-references

- [Coding Standards](Coding-Standards)
- [Architecture Principles § 14](Architecture-Principles#14-versioning-is-contract-breakage-is-migration)
- [Technology Stack](Technology-Stack)
- [Security and Data Policy](Security-and-Data-Policy)
- [Unified Entity Model](Unified-Entity-Model)
