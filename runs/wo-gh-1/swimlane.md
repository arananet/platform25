# Swimlane

Cost is reported as null here. Model runtimes report cost when they run a station; ANVIL never invents a number.

| Station | Status | Duration ms | Artifacts | Cost |
|---|---|---|---|---|
| intake | completed | 0.017 | runs/wo-gh-1/report.json | null |
| spec-writer | executed | 21354.517 | runs/wo-gh-1/spec-writer.output.md | null |
| test-writer | executed | 24436.41 | runs/wo-gh-1/test-writer.output.md | null |
| builder | executed | 80972.339 | runs/wo-gh-1/builder.output.md | null |
| reviewer-spec | executed | 22325.667 | runs/wo-gh-1/reviewer-spec.output.md | null |
| reviewer-security | executed | 12691.802 | runs/wo-gh-1/reviewer-security.output.md | null |
| reviewer-tests | executed | 12068.13 | runs/wo-gh-1/reviewer-tests.output.md | null |
| reviewer-architecture | executed | 21057.307 | runs/wo-gh-1/reviewer-architecture.output.md | null |
| reviewer-design | executed | 5419.975 | runs/wo-gh-1/reviewer-design.output.md | null |
| approver | completed | 0.041 | runs/wo-gh-1/report.json | null |
| approver | loopback | 0.0 | - | null |
| triage-human | completed | 0.006 | - | null |
| deployer | packet_ready | 0.088 | runs/wo-gh-1/deployer.packet.md | null |
| observer | executed | 13723.611 | runs/wo-gh-1/observer.output.md | null |

## Decision

- Approver: Reviewers reviewer-architecture, reviewer-design requested changes.
- Human gate: Verdict is changes_requested, not approved, so a human is required.
