# Swimlane

Cost is reported as null here. Model runtimes report cost when they run a station; ANVIL never invents a number.

| Station | Status | Duration ms | Artifacts | Cost |
|---|---|---|---|---|
| intake | completed | 0.018 | runs/wo-gh-1/report.json | null |
| spec-writer | executed | 25954.149 | runs/wo-gh-1/spec-writer.output.md | null |
| test-writer | executed | 12382.086 | runs/wo-gh-1/test-writer.output.md | null |
| builder | executed | 18842.764 | runs/wo-gh-1/builder.output.md | null |
| reviewer-spec | executed | 13282.66 | runs/wo-gh-1/reviewer-spec.output.md | null |
| reviewer-security | executed | 14959.69 | runs/wo-gh-1/reviewer-security.output.md | null |
| reviewer-tests | executed | 11112.408 | runs/wo-gh-1/reviewer-tests.output.md | null |
| reviewer-architecture | executed | 19854.899 | runs/wo-gh-1/reviewer-architecture.output.md | null |
| reviewer-design | executed | 10231.868 | runs/wo-gh-1/reviewer-design.output.md | null |
| approver | completed | 0.046 | runs/wo-gh-1/report.json | null |
| approver | loopback | 0.0 | - | null |
| triage-human | completed | 0.008 | - | null |
| deployer | packet_ready | 0.194 | runs/wo-gh-1/deployer.packet.md | null |
| observer | executed | 15223.618 | runs/wo-gh-1/observer.output.md | null |

## Decision

- Approver: Reviewer reviewer-design requested changes.
- Human gate: Verdict is changes_requested, not approved, so a human is required.
