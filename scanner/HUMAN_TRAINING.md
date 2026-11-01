# Ali Labs Local Guard — human-reviewed customization

Ali Labs does not pretend that a few prompts constitute model training. The upload guard is a local, explainable rules engine. Its behavior is customized through reviewed rules, scanner findings, and moderator decisions.

When a file is flagged, the moderator records the reason, the file hash, the rule that matched, and the final decision. A rule may be promoted only after human review and regression testing against known-safe and known-malicious fixtures. Never add a rule from an untrusted source without reviewing its scope and false-positive behavior.

The safe pipeline is layered: local signatures and static indicators run first; archive and path checks run next; ClamAV/YARA can add independent detections; and human moderation remains the final approval step. A low-risk result is never a guarantee that a file is safe, and the uploaded binary is not executed during scanning.

For future statistical training, collect a consented, privacy-safe, hash-indexed dataset with labels from at least two reviewers, preserve the original decision rationale, split fixtures into train/validation/test sets, and publish false-positive and false-negative measurements before replacing the explainable rules. Until those measurements exist, keep the deterministic local guard as the source of truth.
