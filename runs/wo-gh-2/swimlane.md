# Swimlane

Cost is reported as null here. Model runtimes report cost when they run a station; ANVIL never invents a number.

| Station | Status | Duration ms | Artifacts | Cost |
|---|---|---|---|---|
| intake | completed | 0.009 | runs/wo-gh-2/report.json | null |
| spec-writer | executed | 18981.211 | runs/wo-gh-2/spec-writer.output.md | null |
| test-writer | executed | 30235.874 | runs/wo-gh-2/test-writer.output.md | null |
| builder | executed | 111267.519 | runs/wo-gh-2/builder.output.md | null |
| reviewer-spec | executed | 44867.605 | runs/wo-gh-2/reviewer-spec.output.md | null |
| reviewer-security | executed | 15975.051 | runs/wo-gh-2/reviewer-security.output.md | null |
| reviewer-tests | executed | 29657.082 | runs/wo-gh-2/reviewer-tests.output.md | null |
| reviewer-architecture | executed | 21363.594 | runs/wo-gh-2/reviewer-architecture.output.md | null |
| reviewer-design | executed | 14728.136 | runs/wo-gh-2/reviewer-design.output.md | null |
| approver | completed | 0.028 | runs/wo-gh-2/report.json | null |
| triage-human | completed | 0.01 | - | null |
| deployer | packet_ready | 0.046 | runs/wo-gh-2/deployer.packet.md | null |
| observer | executed | 17084.619 | runs/wo-gh-2/observer.output.md | null |

## Decision

- Approver: All counted reviews passed.
- Human gate: Verdict approved and no risk hints matched (scanned: auth, payments, data-deletion, production-deploy, secrets, publishing), so no human is required.
