# Scoring Rubric

Use blinded grading against the known ground truth for each case.

## Fields

1. `root_cause_correct`
   Use `1` if the answer identifies the actual direct cause with enough specificity to act on it.
   Use `0.5` if it identifies the right subsystem but not the direct cause.
   Use `0` if it is wrong or too vague.

2. `evidence_useful`
   Use `1` if the cited evidence materially supports the diagnosis.
   Use `0.5` if the evidence is partially relevant.
   Use `0` if evidence is absent, ignored, or misused.

3. `fix_relevant`
   Use `1` if the proposed fix would likely resolve the issue.
   Use `0.5` if the fix is directionally correct but incomplete.
   Use `0` if the fix does not address the direct cause.

4. `hallucination_present`
   Use `1` if the answer asserts unsupported facts, nonexistent files, or nonexistent dependencies.
   Use `0` otherwise.

## Recommended derived metrics

1. Mean root-cause accuracy by variant
2. Mean fix relevance by variant
3. Hallucination rate by variant
4. Per-crash-type accuracy
5. Confidence calibration against correctness

## Suggested grading workflow

1. Freeze the ground truth before running prompts.
2. Randomize answer order before human scoring.
3. Hide variant labels during scoring if possible.
4. Resolve disagreements with a second pass.
